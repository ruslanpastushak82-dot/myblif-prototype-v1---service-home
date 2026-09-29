type AvailabilityDay = {
  label: string;
  highlighted?: boolean;
  slots: string[];
};

// Same 4 days / same 3 time slots per day as before — this section now
// lives in the narrow left column (under Customer Media), so each day is
// its own compact vertical strip (label + 3 slots) instead of a wide row.
// Only 2 day-strips fit in the visible width at once; the rest scroll
// into view horizontally. No data or time slots were removed.
const availabilityDays: AvailabilityDay[] = [
  {
    label: "Today · Sep 21",
    highlighted: true,
    slots: ["10:00–12:00", "13:00–14:30", "16:00–19:00"],
  },
  {
    label: "Sep 22",
    slots: ["08:00–11:00", "12:30–15:00", "17:00–19:00"],
  },
  {
    label: "Sep 23",
    slots: ["09:00–12:00", "14:00–16:00", "17:30–19:00"],
  },
  {
    label: "Sep 24",
    slots: ["07:00–10:00", "11:00–13:00", "15:00–18:00"],
  },
];

export const TechnicianAvailabilitySection = (): JSX.Element => {
  return (
    <div className="flex w-full max-w-[181px] flex-col gap-2 rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffed] px-2.5 py-3 shadow-[0px_2px_8px_#308cf91a]">
      <div className="ml-0.5 w-fit [font-family:'Inter',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-[#012878]">
        Availability
      </div>
      {/*
        Horizontal scroll strip: 2 day-columns (64px + 4px gap each) fit
        within the card's 136px content width at once; Sep 23/24 scroll
        into view without hiding or deleting any date or slot.
      */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {availabilityDays.map((day) => (
          <div key={day.label} className="flex w-[64px] shrink-0 flex-col gap-1">
            <div
              className={`flex h-[22px] items-center justify-center overflow-hidden rounded-lg border border-solid border-[#05388c] px-1 text-center [font-family:'Inter',Helvetica] text-[9px] font-normal leading-[normal] tracking-[0] text-[#052d7a] ${
                day.highlighted ? "bg-[#e8f2ff]" : "bg-white"
              }`}
            >
              <span className="truncate">{day.label}</span>
            </div>
            {day.slots.map((slot) => (
              <div
                key={slot}
                className="flex h-[22px] items-center justify-center overflow-hidden rounded-[7px] border border-solid border-[#05388c] bg-[#f4f9ff] px-1 [font-family:'Inter',Helvetica] text-[9px] font-normal leading-[normal] tracking-[0] text-[#052d7a]"
              >
                <span className="truncate">{slot}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
