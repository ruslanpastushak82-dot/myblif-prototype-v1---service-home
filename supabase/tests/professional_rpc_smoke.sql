-- MYBLIF Service Stage 1 Professional RPC smoke test
-- Run against a disposable/test transaction. Replace <PRO_UUID> only.
-- No writes are performed by the three read RPC checks below.

begin read only;
set local role authenticated;

select set_config(
  'request.jwt.claims',
  json_build_object('sub','<PRO_UUID>','role','authenticated')::text,
  true
);
select set_config('request.jwt.claim.sub','<PRO_UUID>',true);

select auth.uid() as uid_seen;

select reference, professional_status, service_type, submitted_at
from public.get_service_orders_safe()
order by submitted_at desc nulls last;

-- Retired list RPC: this MUST remain inaccessible to authenticated.
select has_function_privilege(
  'authenticated',
  'public.get_service_new_orders_safe()',
  'execute'
) as retired_list_rpc_must_be_false;

select *
from public.get_service_new_order_safe('MYB-S26-138062');

rollback;
