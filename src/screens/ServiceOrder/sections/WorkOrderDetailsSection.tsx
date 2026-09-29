import { Card, CardContent } from "../../../components/ui/card";
import type { CustomerRequest } from "../../../state/CustomerRequestContext";

const mockOrderDetails = [
  { label: "Category", value: "Doors" },
  { label: "Property Type", value: "Commercial Property — Clinic" },
  { label: "Urgency", value: "Urgent" },
  { label: "Preferred Time", value: "Any Time" },
  { label: "Location", value: "968 Albion Road, Etobicoke" },
  { label: "Contact Method", value: "WhatsApp", muted: true },
];

export const WorkOrderDetailsSection = ({
  customerRequest,
}: {
  customerRequest?: CustomerRequest;
}): JSX.Element => {
  // Field labels are the existing Stage 1 UI text (unchanged, per approved
  // geometry) even where the Customer's own field name differs slightly
  // ("Preferred Period" -> "Preferred Time", "Notifications" -> "Contact
  // Method") -- only the values are real, unmodified Customer data. Client
  // Type has no existing row in this list; it's added here for a real
  // order (the underlying card already scrolls internally for extra rows,
  // per the Stage 1 comment on `dl` below -- this isn't a geometry change).
  // Location stays exactly what the Customer entered (city/area), never
  // turned into a precise address. Property Type is the Customer's own
  // selected option, with no added sub-detail. "muted" (the Stage 1
  // Contact Method dimming) was arbitrary mock-only styling, dropped for
  // real data.
  const orderDetails = customerRequest
    ? [
        { label: "Category", value: customerRequest.serviceType },
        { label: "Client Type", value: customerRequest.clientType },
        { label: "Property Type", value: customerRequest.propertyType },
        { label: "Urgency", value: customerRequest.urgency },
        { label: "Preferred Time", value: customerRequest.preferredPeriod },
        { label: "Location", value: customerRequest.approximateLocation },
        { label: "Contact Method", value: customerRequest.notifications },
      ]
    : mockOrderDetails;

  return (
    <Card className="w-full max-w-[633px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
      <CardContent className="p-[14px_20px_10px]">
        <h2 className="[font-family:'Inter',Helvetica] text-xl font-normal leading-7 tracking-[0] text-[#012878]">
          Order Details
        </h2>
        {/*
          Compact spacing (was gap-[15px]/mt-[15px], ~246px total). A
          max-height + overflow-y-auto is added so a future Order Details
          with more fields grows via internal scroll instead of pushing
          the whole screen taller — harmless now since content fits.
        */}
        <dl className="mt-2 flex max-h-[220px] flex-col gap-2 overflow-y-auto pr-1">
          {orderDetails.map((detail) => (
            <div
              key={detail.label}
              className={`grid min-h-[18px] grid-cols-[155px_minmax(0,1fr)] gap-[15px] ${
                "muted" in detail && detail.muted ? "opacity-[0.38]" : ""
              }`}
            >
              <dt className="[font-family:'Inter',Helvetica] text-sm font-normal leading-[18px] tracking-[0] text-[#5e6e85]">
                {detail.label}
              </dt>
              <dd className="w-full max-w-[250px] justify-self-end text-right [font-family:'Inter',Helvetica] text-sm font-medium leading-[18px] tracking-[0] text-[#012878]">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};
