-- Rollback for 20261005183000_fix_service_orders_safe.sql
-- Restores the exact pre-migration function body and grants observed on 2026-10-05.

begin;

create or replace function public.get_service_orders_safe()
returns table(
  id uuid,
  reference text,
  professional_status public.professional_workflow_status,
  critical boolean,
  service_type text,
  request_details text,
  client_type text,
  urgency text,
  preferred_period text,
  approximate_location text,
  property_type text,
  submitted_at timestamp with time zone,
  appointment_decision public.appointment_decision,
  appointment_date date,
  appointment_arrival_time time without time zone,
  appointment_duration_minutes integer,
  work_started_at timestamp with time zone,
  work_finished_at timestamp with time zone,
  actual_duration_minutes integer
)
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  if not exists (
    select 1 from public.profiles p
    where p.id=v_uid and p.account_type='professional'
  ) then raise exception 'Professional account required'; end if;

  return query
  select
    r.id, r.reference, r.professional_status, r.critical,
    r.service_type, i.request_details, i.client_type, i.urgency,
    i.preferred_period, i.approximate_location, i.property_type,
    r.submitted_at,
    r.appointment_decision, r.appointment_date, r.appointment_arrival_time,
    r.appointment_duration_minutes, r.work_started_at, r.work_finished_at,
    r.actual_duration_minutes
  from public.requests r
  left join public.service_request_intake i on i.request_id=r.id
  where
    (
      r.professional_status='new_order'
      and (
        private.is_owner_admin()
        or (
          exists (
            select 1 from public.professional_profiles pp
            where pp.professional_id=v_uid and pp.verification_status='approved'
          )
          and exists (
            select 1 from public.professional_specializations ps
            where ps.professional_id=v_uid
              and lower(trim(ps.specialization))=lower(trim(r.service_type))
          )
        )
      )
    )
    or exists (
      select 1 from public.request_participants rp
      where rp.request_id=r.id and rp.user_id=v_uid
        and rp.participant_role='professional'
    )
  order by r.submitted_at desc;
end;
$function$;

revoke execute on function public.get_service_orders_safe() from public;
revoke execute on function public.get_service_orders_safe() from anon;
grant execute on function public.get_service_orders_safe() to authenticated;

commit;
