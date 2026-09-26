import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
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
    width: "w-[146px]",
    background: "bg-[#e533331a]",
    textClass: "font-normal",
    countBackground: "bg-[#d1282838] text-[#d12828]",
  },
  {
    label: "Installation",
    count: 1,
    width: "w-[126px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-35",
  },
  {
    label: "Delivery",
    count: 0,
    width: "w-[126px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-35",
  },
  {
    label: "Production",
    count: 0,
    width: "w-[153px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
    opacity: "opacity-35",
  },
  {
    label: "Customer Action Needed",
    count: 0,
    width: "w-[206px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "Awaiting Payment",
    count: 0,
    width: "w-[164px]",
    background: "bg-[#fffffff5]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "New Orders",
    count: 8,
    width: "w-[170px]",
    background: "bg-[#308cf91a]",
    textClass: "font-medium",
    countBackground: "bg-[#308cf91f] text-[#012878]",
  },
  {
    label: "Approved",
    count: 0,
    width: "w-[141px]",
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
        <CardContent className="flex h-14 min-w-0 gap-1.5 overflow-x-auto p-0">
          {orderStatuses.map((status, _index) => (
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
            >
              <span>{status.label}</span>
              <Badge>{status.count}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
