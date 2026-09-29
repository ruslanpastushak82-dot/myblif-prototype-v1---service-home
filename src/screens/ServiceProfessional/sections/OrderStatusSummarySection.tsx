import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

type OrderStatus = {
  label: string;
  count: number;
  width: string;
  background: string;
  textClass: string;
  countBackground: string;
  opacity?: string;
};

const orderStatuses: OrderStatus[] = [
  {
    label: "Critical",
    count: 0,
    width: "w-[144px]",
    background: "bg-[#e533331a]",
    textClass: "font-normal",
    countBackground: "bg-[#d1282838] text-[#d12828]",
  },
  {
    label: "Installation",
    count: 1,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Delivery",
    count: 0,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Production",
    count: 0,
    width: "w-[151px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Customer Action Needed",
    count: 0,
    width: "w-[204px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "Awaiting Payment",
    count: 0,
    width: "w-[162px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "New Orders",
    count: 8,
    width: "w-[168px]",
    background: "bg-[#308cf91a]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "Approved",
    count: 0,
    width: "w-[139px]",
    background: "bg-[#33b2661a]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
];

export const OrderStatusSummarySection = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <section
      aria-label="Order status summary"
      className="relative mt-3.5 w-full min-w-0"
    >
      <Card className="w-full overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] shadow-none">
        <CardContent className="flex min-w-0 items-center justify-center gap-[7.4px] overflow-x-auto p-[6px]">
          {orderStatuses.map((status) => (
            <Button
              key={status.label}
              type="button"
              variant="outline"
              aria-pressed={selectedStatus === status.label}
              onClick={() =>
                setSelectedStatus((current) =>
                  current === status.label ? null : status.label,
                )
              }
              className={`h-[42px] shrink-0 items-center justify-between gap-2 rounded-[10px] border-2 border-solid border-[#012878] px-2.5 py-0 font-['Inter',Helvetica] text-[12.5px] ${status.textClass} text-[#012878] ${status.width} ${status.background} ${status.opacity ?? ""}`}
            >
              <span>{status.label}</span>
              <span
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-center text-xs font-normal leading-none tracking-[0] ${status.countBackground}`}
              >
                {status.count}
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
