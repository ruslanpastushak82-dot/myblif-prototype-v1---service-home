import { Card, CardContent } from "../../../components/ui/card";
import type { CustomerRequest } from "../../../state/CustomerRequestContext";

const mockCustomerDetails = [
  { label: "Address", value: "968 Albion Road, Etobicoke" },
  { label: "Name", value: "Vatsal Raval" },
  { label: "Mobile", value: "—" },
];

export const CustomerContactSection = ({
  customerRequest,
  isPreAccept = false,
}: {
  customerRequest?: CustomerRequest;
  isPreAccept?: boolean;
}): JSX.Element => {
  // Relabeled to "Location" (not "Address") for a real order: the value
  // is Approximate Location exactly as the Customer entered it (city/area
  // level, e.g. "Etobicoke"), never turned into a precise street address
  // per Stage 2A §4/§5 -- labeling it "Address" would misrepresent it as
  // precise. This is a label-text correction, not a geometry change; the
  // row structure/layout is identical to Stage 1.
  const customerDetails = customerRequest
    ? isPreAccept
      ? [
          { label: "Location", value: customerRequest.approximateLocation },
          { label: "Contact", value: "Available after acceptance" },
        ]
      : [
        { label: "Location", value: customerRequest.approximateLocation },
        { label: "Name", value: customerRequest.name },
        {
          label: "Mobile",
          // privateNumber = true -> Professional must not see the number
          // at all (not even a fake one). privateNumber = false -> the
          // Customer-entered number, unchanged.
          value: customerRequest.privateNumber
            ? "Private (hidden)"
            : customerRequest.mobileNumber,
        },
      ]
    : mockCustomerDetails;

  return (
    <Card className="w-full max-w-[456px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
      <CardContent className="grid grid-cols-[minmax(0,1fr)_186px] gap-x-[30px] gap-y-1 p-0 px-5 py-2.5 text-[#012878]">
        <h2 className="col-span-2 flex h-[22px] items-center font-['Inter',Helvetica] text-base font-normal leading-normal">
          Customer
        </h2>
        {/*
          whitespace-nowrap previously let the long address line overflow
          past this column's own width and visually sit on top of the
          "Google Maps" line in the next column. Wrapping it (min-h-5
          instead of a fixed h-5) keeps the text inside its own column.
        */}
        <dl className="flex flex-col gap-1 font-['Inter',Helvetica] text-[13px] font-normal leading-5">
          {customerDetails.map((detail) => (
            <div key={detail.label} className="flex min-h-5 items-start">
              <dt className="shrink-0">{detail.label}:</dt>
              <dd className="ml-1">{detail.value}</dd>
            </div>
          ))}
        </dl>
        {/*
          Google Maps link / drive-time estimate is Stage 1 mock-only
          content: it's derived from a precise address and travel-time
          computation the Customer never provides, so per Stage 2A §5
          ("Google Maps/travel time" is explicitly not to be generated) it
          is simply omitted for a real Customer-created order.
        */}
        {!customerRequest && (
          <p className="font-['Inter',Helvetica] text-xs font-medium leading-normal text-[#0c59bf]">
            Google Maps ↗ · 🚗 ~24 хв зараз
          </p>
        )}
      </CardContent>
    </Card>
  );
};
