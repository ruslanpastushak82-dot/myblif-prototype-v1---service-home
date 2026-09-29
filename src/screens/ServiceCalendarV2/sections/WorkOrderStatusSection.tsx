import { useState } from "react";
import { Button } from "../../../components/ui/button";

type WorkOrderStatus = {
  label: string;
  count: number;
  width: string;
  background: string;
  countBackground: string;
  countColor?: string;
  opacity?: string;
  labelWeight?: string;
};

const statuses: WorkOrderStatus[] = [
  {
    label: "Critical",
    count: 0,
    width: "w-[144px]",
    background: "bg-[#e533331a]",
    countBackground: "bg-[#d1282838]",
    countColor: "text-[#d12828]",
    labelWeight: "font-normal",
  },
  {
    label: "Installation",
    count: 1,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    countBackground: "bg-[#308cf91f]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Delivery",
    count: 0,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    countBackground: "bg-[#308cf91f]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Production",
    count: 0,
    width: "w-[151px]",
    background: "bg-[#fffffff5]",
    countBackground: "bg-[#308cf91f]",
    opacity: "opacity-[0.38]",
  },
  {
    label: "Client Action Needed",
    count: 0,
    width: "w-[204px]",
    background: "bg-[#fffffff5]",
    countBackground: "bg-[#308cf91f]",
  },
  {
    label: "Awaiting Payment",
    count: 0,
    width: "w-[162px]",
    background: "bg-[#fffffff5]",
    countBackground: "bg-[#308cf91f]",
  },
  {
    label: "New Requests",
    count: 8,
    width: "w-[168px]",
    background: "bg-[#308cf91a]",
    countBackground: "bg-[#308cf938]",
  },
  {
    label: "Approved",
    count: 0,
    width: "w-[139px]",
    background: "bg-[#33b2661a]",
    countBackground: "bg-[#1b8c4938]",
  },
];

export const WorkOrderStatusSection = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState("Critical");

  return (
    <nav
      aria-label="Work order status"
      className="flex w-full min-w-0 gap-[7.4px] overflow-x-auto rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] p-[6px]"
    >
      {statuses.map((status, _index) => {
        const isSelected = selectedStatus === status.label;

        return (
          <Button
            key={status.label}
            type="button"
            variant="ghost"
            aria-pressed={isSelected}
            onClick={() => setSelectedStatus(status.label)}
            className={`relative h-[42px] shrink-0 justify-start rounded-[10px] border-2 border-solid border-[#012878] px-2.5 py-0 ${status.width} ${status.background} ${status.opacity ?? ""}`}
          >
            <span
              className={`absolute left-2.5 top-[11px] whitespace-nowrap text-left font-['Inter',Helvetica] text-[12.5px] leading-4 tracking-[0] ${status.labelWeight ?? "font-medium"}`}
            >
              {status.label}
            </span>
            <span
              className={`absolute right-2.5 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-full font-['Inter',Helvetica] text-xs font-normal leading-none tracking-[0] ${status.countBackground} ${
                status.countColor ?? "text-[#012878]"
              }`}
            >
              {status.count}
            </span>
          </Button>
        );
      })}
    </nav>
  );
};
