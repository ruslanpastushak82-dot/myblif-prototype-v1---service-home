import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

type WorkOrderStatus = {
  label: string;
  count: number;
  width: string;
  background: string;
  labelWeight: "normal" | "medium";
  opacity?: string;
  countBackground: string;
  countColor: string;
};

const workOrderStatuses: WorkOrderStatus[] = [
  {
    label: "Critical",
    count: 0,
    width: "w-[146px]",
    background: "bg-[#e533331a]",
    labelWeight: "normal",
    countBackground: "bg-[#d1282838]",
    countColor: "text-[#d12828]",
  },
  {
    label: "Installation",
    count: 1,
    width: "w-[126px]",
    background: "bg-[#fffffff5]",
    labelWeight: "medium",
    opacity: "opacity-[0.38]",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "Delivery",
    count: 0,
    width: "w-[126px]",
    background: "bg-[#fffffff5]",
    labelWeight: "medium",
    opacity: "opacity-[0.38]",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "Production",
    count: 0,
    width: "w-[153px]",
    background: "bg-[#fffffff5]",
    labelWeight: "medium",
    opacity: "opacity-[0.38]",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "Client Action Needed",
    count: 0,
    width: "w-[206px]",
    background: "bg-[#fffffff5]",
    labelWeight: "medium",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "Awaiting Payment",
    count: 0,
    width: "w-[164px]",
    background: "bg-[#fffffff5]",
    labelWeight: "medium",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "New Orders",
    count: 8,
    width: "w-[170px]",
    background: "bg-[#308cf91a]",
    labelWeight: "medium",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
  {
    label: "Approved",
    count: 0,
    width: "w-[141px]",
    background: "bg-[#33b2661a]",
    labelWeight: "medium",
    countBackground: "bg-[#308cf91f]",
    countColor: "text-[#012878]",
  },
];

export const WorkOrderStatusSection = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState("Critical");

  return (
    <nav
      aria-label="Work order statuses"
      className="mx-auto flex h-[54px] w-full max-w-[1296px] overflow-x-auto rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] pl-1.5 pr-1.5"
    >
      <div className="flex min-w-max gap-[7.4px]">
        {workOrderStatuses.map((status) => {
          const isSelected = selectedStatus === status.label;

          return (
            <Button
              key={status.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedStatus(status.label)}
            >
              <span>{status.label}</span>
              <Badge>{status.count}</Badge>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
