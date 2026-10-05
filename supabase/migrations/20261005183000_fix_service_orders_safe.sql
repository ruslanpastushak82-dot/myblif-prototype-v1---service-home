-- MYBLIF Service Stage 1: repair Professional Orders read path.
-- Source of truth: request fields live on public.requests.
-- service_request_intake is used only as an intake-existence eligibility condition.

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
  submitted_at timestamptz,
  appointment_decision public.appointment_decision,
  appointment_date date,
  appointment_arrival_time time without time zone,
  appointment_duration_minutes integer,
  work_started_at timestamptz,
  work_finished_at timestamptz,
  actual_duration_minutes integer
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_uid
      and p.account_type = 'professional'::public.account_type
  ) then
    raise exception 'Professional account required';
  end if;

  return query
  select
    r.id,
    r.reference,
    r.professional_status,
    r.critical,
    r.service_type,
    r.request_details,
    r.client_type,
    r.urgency,
    r.preferred_period,
    r.approximate_location,
    r.property_type,
    r.submitted_at,
    r.appointment_decision,
    r.appointment_date,
    r.appointment_arrival_time,
    r.appointment_duration_minutes,
    r.work_started_at,
    r.work_finished_at,
    r.actual_duration_minutes
  from public.requests r
  where (
    r.professional_status = 'new_order'::public.professional_workflow_status
    and exists (
      select 1
      from public.service_request_intake i
      where i.request_id = r.id
    )
    and (
      private.is_owner_admin()
      or (
        exists (
          select 1
          from public.professional_profiles pp
          where pp.professional_id = v_uid
            and pp.verification_status = 'approved'
        )
        and exists (
          select 1
          from public.professional_specializations ps
          where ps.professional_id = v_uid
            and lower(btrim(ps.specialization)) = lower(btrim(r.service_type))
        )
      )
    )
  )
  or exists (
    select 1
    from public.request_participants rp
    where rp.request_id = r.id
      and rp.user_id = v_uid
      and rp.participant_role = 'professional'
  )
  order by r.submitted_at desc;
end;
$function$;

revoke all on function public.get_service_orders_safe() from public;
revoke all on function public.get_service_orders_safe() from anon;
grant execute on function public.get_service_orders_safe() to authenticated;
