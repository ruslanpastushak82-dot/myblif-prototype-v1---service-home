import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  OperatingFilterKey,
  operatingFilterCounts,
  operatingFilterDefinitions,
} from "./operatingFilterData";

/**
 * Shared Operating Filter Bar for all Professional screens (Stage 7).
 *
 * Geometry/style is copied from the finalized Calendar Month status bar
 * (JobStatusSummarySection) as-is, not reinvented: 42px pill height, 10px
 * radius, 2px solid #012878 border, 7.4px gaps between pills, 6px outer
 * padding, 12.5px Inter label, 22px round counter badge, absolute-positioned
 * label (left-2.5) and counter (right-8) inside each pill, content-hugging
 * per-label width (not stretched), the row centered with normal free space
 * either side — exactly the Calendar Month box model.
 *
 * Behavior is new for Stage 7 — this is a single-select FILTER bar, not a
 * lifecycle editor:
 * - no filter is selected on mount;
 * - clicking a filter selects it (max one at a time);
 * - clicking the already-selected filter clears the selection;
 * - Critical is an independent attention flag, not a lifecycle stage —
 *   its red "attention" look is driven by count > 0, not by selection,
 *   and is visually distinct from the selection ring.
 */

const filterWidths: Record<OperatingFilterKey, string> = {
  critical: "w-[144px]",
  newOrders: "w-[151px]",
  underReview: "w-[157px]",
  awaitingResponse: "w-[179px]",
  approved: "w-[139px]",
  completed: "w-[145px]",
};

export const OperatingFilterBar = (): JSX.Element => {
  const [selected, setSelected] = useState<OperatingFilterKey | null>(null);

  const handleClick = (key: OperatingFilterKey) => {
    setSelected((current) => (current === key ? null : key));
  };

  return (
    <Card
      aria-label="Operating filter bar"
      className="w-full overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] shadow-none"
    >
      <CardContent className="flex min-h-[54px] w-full items-center justify-center gap-[7.4px] overflow-x-auto p-[6px]">
        {operatingFilterDefinitions.map((filter) => {
          const count = operatingFilterCounts[filter.key];
          const isSelected = selected === filter.key;
          const isCritical = filter.key === "critical";
          const isCriticalAttention = isCritical && count > 0;

          const background = isCritical
            ? isCriticalAttention
              ? "bg-[#e533331a]"
              : "bg-[#fffffff5]"
            : filter.key === "newOrders"
              ? "bg-[#308cf91a]"
              : filter.key === "approved"
                ? "bg-[#33b2661a]"
                : "bg-[#fffffff5]";

          const muted = isCritical && !isCriticalAttention ? "opacity-[0.45]" : "";

          const counterBackground = isCritical
            ? isCriticalAttention
              ? "bg-[#d1282838]"
              : "bg-[#308cf91f]"
            : filter.key === "approved"
              ? "bg-[#1b8c4938]"
              : "bg-[#308cf91f]";

          const counterText =
            isCritical && isCriticalAttention ? "text-[#d12828]" : "text-[#012878]";

          const textWeight = isCritical ? "font-normal" : "font-medium";

          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${filter.label}: ${count}`}
              onClick={() => handleClick(filter.key)}
              className={`${filterWidths[filter.key]} ${background} ${muted} ${
                isSelected ? "ring-2 ring-offset-1 ring-[#308cf9]" : ""
              } relative h-[42px] shrink-0 rounded-[10px] border-2 border-solid border-[#012878] p-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#012878] focus-visible:ring-offset-1`}
            >
              <span
                className={`absolute left-2.5 top-[11px] whitespace-nowrap [font-family:'Inter',Helvetica] ${textWeight} text-[12.5px] leading-4 tracking-[0] text-[#012878]`}
              >
                {filter.label}
              </span>
              <span
                className={`absolute right-[8px] top-[9px] flex h-[22px] w-[22px] items-center justify-center rounded-full ${counterBackground} [font-family:'Inter',Helvetica] text-xs font-normal leading-none ${counterText}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
