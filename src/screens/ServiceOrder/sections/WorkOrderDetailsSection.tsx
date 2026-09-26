import { Card, CardContent } from "../../../components/ui/card";

const orderDetails = [
  {
    label: "Category",
    value: "Doors",
  },
  {
    label: "Property Type",
    value: "Commercial Property — Clinic",
  },
  {
    label: "Urgency",
    value: "Urgent",
  },
  {
    label: "Preferred Time",
    value: "Any Time",
  },
  {
    label: "Location",
    value: "968 Albion Road, Etobicoke",
  },
  {
    label: "Contact Method",
    value: "WhatsApp",
    muted: true,
  },
];

export const WorkOrderDetailsSection = (): JSX.Element => {
  return (
    <Card className="w-full max-w-[633px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
      <CardContent className="p-[14px_20px_6px]">
        <h2 className="[font-family:'Inter',Helvetica] text-xl font-normal leading-7 tracking-[0] text-[#012878]">
          Order Details
        </h2>
        <dl className="mt-[15px] flex flex-col gap-[15px]">
          {orderDetails.map((detail) => (
            <div
              key={detail.label}
              className={`grid min-h-[18px] grid-cols-[155px_minmax(0,1fr)] gap-[15px] ${
                detail.muted ? "opacity-[0.38]" : ""
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
