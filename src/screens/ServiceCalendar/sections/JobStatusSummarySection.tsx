import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

type JobStatus = {
  label: string;
  count: number;
  width: string;
  background: string;
  counterBackground: string;
  counterText: string;
  textWeight: string;
  opacity?: string;
  counterPosition: string;
};

const jobStatuses: JobStatus[] = [
  {
    label: "Critical",
    count: 0,
    width: "w-[144px]",
    background: "bg-[#e533331a]",
    counterBackground: "bg-[#d1282838]",
    counterText: "text-[#d12828]",
    textWeight: "font-normal",
    counterPosition: "right-[8px]",
  },
  {
    label: "Installation",
    count: 1,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    counterBackground: "bg-[#308cf91f]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    opacity: "opacity-[0.38]",
    counterPosition: "right-[8px]",
  },
  {
    label: "Delivery",
    count: 0,
    width: "w-[124px]",
    background: "bg-[#fffffff5]",
    counterBackground: "bg-[#308cf91f]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    opacity: "opacity-[0.38]",
    counterPosition: "right-[8px]",
  },
  {
    label: "Production",
    count: 0,
    width: "w-[151px]",
    background: "bg-[#fffffff5]",
    counterBackground: "bg-[#308cf91f]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    opacity: "opacity-[0.38]",
    counterPosition: "right-[8px]",
  },
  {
    label: "Client Action Needed",
    count: 0,
    width: "w-[204px]",
    background: "bg-[#fffffff5]",
    counterBackground: "bg-[#308cf91f]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    counterPosition: "right-[8px]",
  },
  {
    label: "Awaiting Payment",
    count: 0,
    width: "w-[162px]",
    background: "bg-[#fffffff5]",
    counterBackground: "bg-[#308cf91f]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    counterPosition: "right-[8px]",
  },
  {
    label: "New Requests",
    count: 8,
    width: "w-[168px]",
    background: "bg-[#308cf91a]",
    counterBackground: "bg-[#308cf938]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    counterPosition: "right-[8px]",
  },
  {
    label: "Approved",
    count: 0,
    width: "w-[139px]",
    background: "bg-[#33b2661a]",
    counterBackground: "bg-[#1b8c4938]",
    counterText: "text-[#012878]",
    textWeight: "font-medium",
    counterPosition: "right-[8px]",
  },
];

export const JobStatusSummarySection = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState("Critical");

  return (
    <Card className="w-full overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] shadow-none">
      <CardContent className="flex min-h-[54px] w-full items-center justify-center gap-[7.4px] overflow-x-auto p-[6px]">
        {jobStatuses.map((status, index) => {
          const isSelected = selectedStatus === status.label;

          return (
            <button
              key={status.label}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedStatus(status.label)}
              className={`${status.width} ${status.background} ${status.opacity ?? ""} relative h-[42px] shrink-0 rounded-[10px] border-2 border-solid border-[#012878] p-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#012878] focus-visible:ring-offset-1`}
            >
              <span
                className={`absolute left-2.5 top-[11px] whitespace-nowrap [font-family:'Inter',Helvetica] ${status.textWeight} text-[12.5px] leading-4 tracking-[0] text-[#012878]`}
              >
                {status.label}
              </span>
              <span
                className={`absolute ${status.counterPosition} top-[9px] flex h-[22px] w-[22px] items-center justify-center rounded-full ${status.counterBackground} [font-family:'Inter',Helvetica] text-xs font-normal leading-none ${status.counterText}`}
              >
                {status.count}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
