import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";

const _navy = "text-[#012878]";
const _border = "border-[#012878]";
const panel =
  "rounded-[14px] border-2 border-[#012878] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]";

const viewOptions = ["Day", "Week", "Month", "Today", "Upcoming", "Deadlines"];

const serviceRows = [
  ["Doors", "Furniture", "Assembly & Installation", "Welding", "Plumbing"],
  [
    "TV Mounting",
    "Garage Doors",
    "Caulking & Sealing",
    "Window & Exterior Sealing",
    "Other Repairs",
  ],
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calendarDates = [
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  null,
  null,
  null,
  null,
  null,
  null,
];

const calendarEvents: Record<
  number,
  { title: string; reference: string; status: string; highlighted?: boolean }
> = {
  16: {
    title: "Doors",
    reference: "MYB-S26-583742",
    status: "Completed",
    highlighted: true,
  },
  17: {
    title: "Plumbing",
    reference: "MYB-S26-328641",
    status: "→ 22 Sep · 09:30",
  },
  19: {
    title: "Garage Doors",
    reference: "MYB-S26-714205",
    status: "→ 23 Sep · 10:00",
  },
};

const occupancyDays = [
  { day: "21", am: "free", pm: "free" },
  { day: "22", am: "free", pm: "busy" },
  { day: "23", am: "busy", pm: "free" },
  { day: "24", am: "free", pm: "busy" },
  { day: "25", am: "free", pm: "free" },
  { day: "26", am: "free", pm: "free" },
  { day: "27", am: "free", pm: "free" },
];

const plannedTime = [
  { name: "Doors", value: "0 h · 0%", width: "w-[33px]" },
  { name: "Furniture", value: "0 h · 0%", width: "w-[55px]" },
  { name: "Plumbing", value: "3 h · 30%", width: "w-[33px]" },
  { name: "Welding", value: "4 h · 40%", width: "w-[33px]" },
  { name: "Other Work", value: "3 h · 30%", width: "w-[66px]" },
];

const actualTime = [
  { name: "Doors", value: "0 h · 0%", width: "w-11" },
  { name: "Furniture", value: "0 h · 0%", width: "w-11" },
  { name: "Plumbing", value: "0 h · 0%", width: "w-[33px]" },
  { name: "Welding", value: "0 h · 0%", width: "w-11" },
  { name: "Other Work", value: "0 h · 0%", width: "w-[55px]" },
];

const availabilityOptions = [
  { label: "Free Day", selected: true },
  { label: "Free AM", selected: false },
  { label: "Busy Day", selected: false },
  { label: "Free PM", selected: false },
];

function TimeSummary({
  title,
  total,
  items,
}: {
  title: string;
  total: string;
  items: typeof plannedTime;
}) {
  return (
    <Card className={`${panel} min-w-0`}>
      <CardContent className="p-1.5">
        <div className="mb-1 flex items-center justify-between gap-2 px-2 text-[11px]">
          <span>{title}</span>
          <span className="whitespace-nowrap">{total}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => (
            <div
              key={`${title}-${item.name}`}
              className="relative min-w-0 overflow-hidden rounded-[10px] border-2 border-[#012878] bg-[#ffffffc7] px-2 py-1"
            >
              <div className="flex items-center justify-between gap-1 text-[9px] sm:text-xs">
                <span className="truncate">{item.name}</span>
                <span className="whitespace-nowrap text-[8px] sm:text-xs">
                  {item.value}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-[5px] bg-[#dceeff]">
                <div
                  className={`h-full rounded-[5px] bg-[#308cf9] ${item.width}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarCell({
  date,
  column,
  realEvents = [],
}: {
  date: number | null;
  column: number;
  realEvents?: Array<{ title: string; reference: string; status: string }>;
}) {
  const mockEvent = date ? calendarEvents[date] : undefined;
  const event = realEvents[0] ?? mockEvent;

  return (
    <div
      className={`min-h-[50px] overflow-hidden border-t border-[#012878] p-1.5 ${
        column > 0 ? "border-l" : ""
      } ${event?.highlighted ? "rounded-lg border-2 border-[#0a3f9e]" : ""}`}
    >
      {date && (
        <>
          <div className="text-[11px] font-medium leading-none sm:text-[15px]">
            {date}
          </div>
          {event && (
            <div className="mt-0.5 pl-5 text-[6px] leading-[1.15] text-black sm:text-[8px]">
              <div className="truncate">
                {event.title} · {event.reference}
              </div>
              <div>{event.status}</div>
              {date === 19 && <div>Declined</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const SchedulingDashboardSection = (): JSX.Element => {
  const [selectedView, setSelectedView] = useState("Month");
  const [selectedAvailability, setSelectedAvailability] = useState("Free Day");
  const [confirmedEvents, setConfirmedEvents] = useState<any[]>([]);

  useEffect(() => {
    void supabase.rpc("get_professional_calendar_events").then(({ data, error }) => {
      if (!error && data) {
        setConfirmedEvents(
          data.filter(
            (item) =>
              item.appointment_date >= "2026-09-01" &&
              item.appointment_date <= "2026-09-30",
          ),
        );
      }
    });
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[1296px] flex-col gap-2 px-1 py-1 text-[#012878]">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <ToggleGroup
          type="single"
          value={selectedView}
          onValueChange={(value) => value && setSelectedView(value)}
          className="flex flex-wrap justify-start gap-1.5"
          aria-label="Calendar view"
        >
          {viewOptions.map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              aria-label={`${option} view`}
              className={`h-11 min-w-[78px] rounded-[10px] border-2 border-[#012878] bg-white px-3 text-xs shadow-[0px_2px_6px_#308cf926] data-[state=on]:bg-[#308cf9] data-[state=on]:text-white sm:min-w-[111px] sm:text-sm ${
                option === "Today" ||
                option === "Upcoming" ||
                option === "Deadlines"
                  ? "opacity-45"
                  : ""
              }`}
              disabled={
                option === "Today" ||
                option === "Upcoming" ||
                option === "Deadlines"
              }
            >
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-[81.75px] shrink-0 rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2.5 text-sm text-[#012878]"
          aria-label="Select language"
        >
          <span className="flex h-full w-full items-center justify-center gap-1.5 leading-none">
            <span aria-hidden="true" className="inline-flex items-center leading-none">
              🌐
            </span>
            <span className="inline-flex items-center leading-none">EN</span>
            <span
              aria-hidden="true"
              className="inline-flex -translate-y-1.5 items-center leading-none"
            >
              ⌄
            </span>
          </span>
        </Button>
      </header>
      <div className="h-px w-full bg-[#308cf959]" />
      <nav
        className="grid grid-cols-2 gap-2 sm:grid-cols-5"
        aria-label="Service categories"
      >
        {serviceRows.flat().map((service) => (
          <Button
            key={service}
            type="button"
            variant="outline"
            className="h-11 min-w-0 rounded-[10px] border-2 border-[#012878] bg-[#ffffffeb] px-1 text-[10px] font-medium shadow-[0px_2px_6px_#308cf91f] sm:text-[12px] lg:text-[13px]"
          >
            <span className="truncate">{service}</span>
          </Button>
        ))}
      </nav>
      <Card className={`${panel} overflow-hidden`}>
        <CardContent className="p-2 sm:p-4 lg:p-6">
          <div className="mb-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-[10px] border-[1.5px] border-[#308cf9] bg-[#ffffffeb]"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <h1 className="whitespace-nowrap text-base font-normal sm:text-xl">
              September 2026
            </h1>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-[10px] border-[1.5px] border-[#308cf9] bg-[#ffffffeb]"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-[10px] px-3 text-xs font-medium"
            >
              Today 21
            </Button>
          </div>
          <div className="min-w-[680px] overflow-hidden border border-[#012878]">
            <div className="grid grid-cols-7">
              {weekdays.map((day, dayIndex) => (
                <div
                  key={day}
                  className={`flex h-8 items-center justify-center border-b border-[#012878] text-[10px] text-[#308cf9] sm:text-[13px] ${
                    dayIndex > 0 ? "border-l" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
              {calendarDates.map((date, index) => (
                <CalendarCell
                  key={`${date ?? "empty"}-${index}`}
                  date={date}
                  column={index % 7}
                  realEvents={
                    date
                      ? confirmedEvents
                          .filter(
                            (item) =>
                              Number(item.appointment_date.slice(-2)) === date,
                          )
                          .map((item) => ({
                            title: item.service_type,
                            reference: item.reference,
                            status: item.appointment_arrival_time?.slice(0, 5) ?? "",
                          }))
                      : []
                  }
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={`${panel} overflow-hidden`}>
        <CardContent className="grid gap-2 p-1.5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <section>
            <div className="px-1 text-xs sm:text-[15px]">
              Occupancy — Sep 21–27, 2026
            </div>
            <div className="mt-1 grid grid-cols-[auto_auto_auto_repeat(7,minmax(38px,1fr))] items-center gap-x-2 gap-y-1 text-[9px] font-medium sm:text-[11px]">
              <span className="col-span-1" />
              <span className="rounded-[3px] border border-[#308cf959] bg-[#dceeff] px-1">
                Free
              </span>
              <span className="rounded-[3px] bg-[#308cf9] px-1 text-white">
                Busy
              </span>
              <span>AM · 7:00–12:00</span>
              <span className="col-span-7" />
              <span>PM · 12:00–7:00</span>
              {occupancyDays.map((item) => (
                <div key={item.day} className="flex flex-col gap-1 text-center">
                  <span>{item.day}</span>
                  <span
                    className={`h-2 rounded-[3px] ${item.am === "busy" ? "bg-[#308cf9]" : "bg-[#dceeff]"}`}
                  />
                  <span
                    className={`h-2 rounded-[3px] ${item.pm === "busy" ? "bg-[#308cf9]" : "bg-[#dceeff]"}`}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border-2 border-[#012878] px-3 text-[11px]">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-[18px] flex-col overflow-hidden rounded-lg border border-[#308cf980]">
                <div className="h-[26px] bg-[#dceeff]" />
                <div className="h-0.5 bg-[#308cf9]" />
              </div>
              <div className="text-xs font-medium leading-5">
                <div>Occupancy</div>
                <div>Free 79%</div>
                <div>Busy 21%</div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      <TimeSummary
        title="Planned Time — Sep 21–27, 2026"
        total="Total: 10 h"
        items={plannedTime}
      />
      <TimeSummary
        title="Actual Time — Sep 21–27, 2026"
        total="Total: 0 h"
        items={actualTime}
      />
      <section className="grid gap-2 lg:grid-cols-[455px_435px_minmax(0,1fr)]">
        <Card className={panel}>
          <CardContent className="p-2">
            <h2 className="mb-2 px-3 text-lg font-normal">Availability</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {availabilityOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedAvailability(option.label)}
                  className="h-7 justify-start gap-2 rounded-[10px] border-2 border-[#012878] px-1.5 text-[11px] font-normal sm:text-[15px]"
                  aria-pressed={selectedAvailability === option.label}
                >
                  <span
                    className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[#308cf9] ${
                      selectedAvailability === option.label
                        ? "bg-[#308cf9]"
                        : "bg-white"
                    }`}
                  />
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={panel}>
          <CardContent className="p-4">
            <h2 className="mb-3 text-base font-normal">Reminders</h2>
            <div className="grid grid-cols-3 gap-2">
              {["1 hour before", "1 day before", "+ Add"].map((reminder) => (
                <Button
                  key={reminder}
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-[#ffffffeb] px-1 text-[10px] font-medium sm:text-xs"
                >
                  {reminder}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={panel}>
          <CardContent className="flex h-full flex-col gap-1.5 p-4">
            <h2 className="text-base font-normal">Doors</h2>
            <div className="text-sm font-medium">MYB-S26-583742</div>
            <div className="text-xs sm:text-sm">
              16.09.2026 • близько 5:30 PM
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
