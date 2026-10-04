import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfessionalShell } from "../../components/ProfessionalShell/ProfessionalShell";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useCustomerRequest } from "../../state/CustomerRequestContext";
import { CustomerContactSection } from "./sections/CustomerContactSection";
import { CustomerMediaSection } from "./sections/CustomerMediaSection";
import { EstimateManagementSection } from "./sections/EstimateManagementSection";
import { ReminderSchedulingSection } from "./sections/ReminderSchedulingSection";
import { ServiceRequestDescriptionSection } from "./sections/ServiceRequestDescriptionSection";
import { TechnicianAvailabilitySection } from "./sections/TechnicianAvailabilitySection";
import { TechnicianChatSection } from "./sections/TechnicianChatSection";
import { WorkOrderDetailsSection } from "./sections/WorkOrderDetailsSection";

const mockWorkOrder = {
  title: "Automatic Door Repair",
  reference: "MYB-S26-583742",
  received: "Received Sep 16, 2026",
};

const formatReceived = (timestamp: number | null): string => {
  if (!timestamp) return "—";
  const formatted = new Date(timestamp).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `Received ${formatted}`;
};

export const ServiceOrder = (): JSX.Element => {
  // /service-order (no :reference) keeps rendering the original Stage 1
  // mock work order, byte-for-byte unchanged -- "не ламай /service-order
  // без необхідності". /service-order/:reference looks up a real,
  // Customer-submitted order from shared state; if the reference doesn't
  // match anything (bad link, order not found), it also falls back to the
  // same untouched mock rather than crashing.
  const { reference } = useParams<{ reference?: string }>();
  const { getRequestByReference } = useCustomerRequest();
  const contextRequest = !reference ? getRequestByReference(reference ?? "") : undefined;
  const [backendRequest, setBackendRequest] = useState<Record<string, any> | null>(null);
  const [isPreAccept, setIsPreAccept] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const loadBackendRequest = useCallback(async () => {
    if (!reference) return;

    // Security boundary: always check the safe pre-Accept view first.
    // Only when the request is no longer available there may this screen
    // ask RLS for the full row.
    const { data: safeData, error: safeError } = await supabase.rpc(
      "get_service_new_order_safe",
      { p_reference: reference },
    );
    if (safeError) return;

    const safeRequest = Array.isArray(safeData) ? safeData[0] : safeData;
    if (safeRequest) {
      setBackendRequest(safeRequest);
      setIsPreAccept(true);
      return;
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("reference", reference)
      .maybeSingle();
    if (!error) {
      setBackendRequest(data);
      setIsPreAccept(false);
    }
  }, [reference]);

  useEffect(() => {
    let active = true;
    if (!reference) return;

    void loadBackendRequest().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [reference, loadBackendRequest]);

  const handleAccept = async () => {
    if (!backendRequest?.id || !isPreAccept || isAccepting) return;
    setIsAccepting(true);
    const { error } = await supabase.rpc("accept_service_request", {
      p_request_id: backendRequest.id,
    });
    if (!error) await loadBackendRequest();
    setIsAccepting(false);
  };

  const customerRequest = reference ? (backendRequest ? {
    id: backendRequest.id,
    reference: backendRequest.reference,
    status: backendRequest.status,
    submittedAt: new Date(backendRequest.submitted_at).getTime(),
    professionalStatus: backendRequest.professional_status,
    critical: backendRequest.critical,
    serviceType: backendRequest.service_type,
    requestDetails: backendRequest.request_details,
    photos: [], videos: [], clientType: backendRequest.client_type,
    urgency: backendRequest.urgency ?? "", preferredPeriod: backendRequest.preferred_period ?? "",
    notifications: backendRequest.notifications, name: backendRequest.customer_name,
    mobileNumber: backendRequest.mobile_number, privateNumber: backendRequest.private_number,
    approximateLocation: backendRequest.approximate_location, propertyType: backendRequest.property_type ?? "",
    appointment: backendRequest.appointment_date ? { date: backendRequest.appointment_date, time: backendRequest.appointment_arrival_time ?? "", duration: backendRequest.appointment_duration_minutes ? `${backendRequest.appointment_duration_minutes} min` : "", price: "" } : null,
    appointmentDecision: backendRequest.appointment_decision, messages: [],
  } : undefined) : contextRequest;

  const workOrder = customerRequest
    ? {
        // Customer Request has no separate "title" field -- Service Type
        // is the real field closest to a heading, used as-is.
        title: customerRequest.serviceType,
        reference: customerRequest.reference ?? "—",
        received: formatReceived(customerRequest.submittedAt),
      }
    : mockWorkOrder;

  return (
    <ProfessionalShell activeNavItem="Orders">
      <div className="-mt-2 flex items-center justify-between gap-4 px-1">
        <div className="flex min-w-0 translate-y-[3px] flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h1 className="[font-family:'Inter',Helvetica] text-[28px] font-normal leading-none tracking-normal text-[#012878]">
            {workOrder.title}
          </h1>
          <p className="[font-family:'Inter',Helvetica] text-sm font-medium leading-5 text-[#5e6e85]">
            {workOrder.reference}
            <span className="px-2">•</span>
            {workOrder.received}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {reference && backendRequest && isPreAccept && (
            <Button
              type="button"
              onClick={() => void handleAccept()}
              disabled={isAccepting}
              className="h-10 rounded-xl border-2 border-[#012878] bg-[#fcce5e] px-4 text-sm font-bold text-[#012878] shadow-none hover:bg-[#fcce5e] hover:brightness-95 disabled:opacity-50"
            >
              {isAccepting ? "Accepting…" : "Accept & Contact Customer"}
            </Button>
          )}
          <Select defaultValue="EN">
          <SelectTrigger
            aria-label="Language"
            className="h-10 w-20 shrink-0 translate-y-[5px] rounded-xl border-2 border-[#012878] bg-white/80 px-2 text-[#012878]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EN">🌐 EN</SelectItem>
          </SelectContent>
          </Select>
        </div>
      </div>
      {/*
        Explicit 3-column layout (same column proportions as before:
        media / center / right) instead of relying on CSS grid
        auto-placement across the whole page. Each column is its own
        vertical flex stack, so stacking order is deterministic:
        left = Customer Media -> Availability (moved here, normal flow),
        center = Order Details -> Request Description -> MYBLIF Chat,
        right = Customer -> Estimate -> Reminders.
      */}
      <div className="mt-2 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(88px,0.29fr)_minmax(0,1fr)_minmax(220px,0.72fr)] sm:items-start">
        <div className="flex min-w-0 flex-col gap-3">
          <CustomerMediaSection customerRequest={customerRequest} />
          <TechnicianAvailabilitySection />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <WorkOrderDetailsSection customerRequest={customerRequest} />
          <ServiceRequestDescriptionSection customerRequest={customerRequest} />
          <TechnicianChatSection customerRequest={customerRequest} isPreAccept={isPreAccept} />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <CustomerContactSection customerRequest={customerRequest} />
          <EstimateManagementSection isPreAccept={isPreAccept} />
          <ReminderSchedulingSection />
        </div>
      </div>
    </ProfessionalShell>
  );
};
