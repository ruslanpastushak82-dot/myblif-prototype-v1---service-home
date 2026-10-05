begin;

create or replace function public.get_service_new_order_safe(p_reference text)
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
  submitted_at timestamp with time zone
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    o.id,
    o.reference,
    o.professional_status,
    o.critical,
    o.service_type,
    o.request_details,
    o.client_type,
    o.urgency,
    o.preferred_period,
    o.approximate_location,
    o.property_type,
    o.submitted_at
  from public.get_service_orders_safe() o
  where o.reference = p_reference
    and o.professional_status = 'new_order'::public.professional_workflow_status
  limit 1;
$function$;

revoke execute on function public.get_service_new_order_safe(text) from public;
revoke execute on function public.get_service_new_order_safe(text) from anon;
grant execute on function public.get_service_new_order_safe(text) to authenticated;

commit;
