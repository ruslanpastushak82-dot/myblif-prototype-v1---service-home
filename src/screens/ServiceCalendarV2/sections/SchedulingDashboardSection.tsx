import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";

const navy = "text-[#012878]";
const border = "border-[#012878]";
const panel =
  "border-2 border-[#012878] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]";
const softPanel = "border-2 border-[#012878] bg-[#ffffffeb]";

const viewOptions = [
  { label: "Day", disabled: false },
  { label: "Week", disabled: false },
  { label: "Month", disabled: false },
  { label: "Today", disabled: true },
  { label: "Upcoming", disabled: true },
  { label: "Deadlines", disabled: true },
];

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

const days = [
  { day: "Mon", date: "21" },
  { day: "Tue", date: "22" },
  { day: "Wed", date: "23" },
  { day: "Thu", date: "24", badge: "+1" },
  { day: "Fri", date: "25" },
  { day: "Sat", date: "26" },
  { day: "Sun", date: "27", badge: "+2", warning: true, selected: true },
];

const events = [
  {
    day: 1,
    title: "Plumbing",
    id: "MYB-S26-328641",
    date: "17 → 22 Sep · 09:30",
    status: "Rework",
  },
  {
    day: 2,
    title: "Garage Doors",
    id: "MYB-S26-714205",
    date: "19 → 23 Sep · 10:00",
    status: "Rescheduled",
  },
  {
    day: 3,
    title: "Welding",
    id: "MYB-S26-905317",
    date: "24 Sep · 13:00",
    status: "Scheduled",
  },
];

const occupancyDays = [
  { date: "21", am: "free", pm: "free" },
  { date: "22", am: "free", pm: "busy" },
  { date: "23", am: "busy", pm: "free" },
  { date: "24", am: "free", pm: "busy" },
  { date: "25", am: "free", pm: "free" },
  { date: "26", am: "free", pm: "free" },
  { date: "27", am: "free", pm: "free" },
];

const plannedItems = [
  { name: "Doors", value: "0 h · 0%", width: "33px" },
  { name: "Furniture", value: "0 h · 0%", width: "55px" },
  { name: "Plumbing", value: "3 h · 30%", width: "33px" },
  { name: "Welding", value: "4 h · 40%", width: "33px" },
  { name: "Other Work", value: "3 h · 30%", width: "66px" },
];

const actualItems = [
  { name: "Doors", value: "0 h · 0%", width: "44px" },
  { name: "Furniture", value: "0 h · 0%", width: "44px" },
  { name: "Plumbing", value: "0 h · 0%", width: "33px" },
  { name: "Welding", value: "0 h · 0%", width: "44px" },
  { name: "Other Work", value: "0 h · 0%", width: "55px" },
];

function TimeSummary({
  title,
  total,
  items,
}: {
  title: string;
  total: string;
  items: typeof plannedItems;
}): JSX.Element {
  return (
    <Card className={`${panel} min-w-0 rounded-xl`}>
      <CardContent className="p-1.5">
        <div className="mb-1 flex items-center justify-between px-2 text-[11px] text-[#012878]">
          <span>{title}</span>
          <span>{total}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="min-w-0 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffc7] px-2 py-1"
            >
              <div className="flex items-center justify-between gap-1 text-[10px] text-[#012878]">
                <span className="truncate">{item.name}</span>
                <span className="shrink-0">{item.value}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-[5px] bg-[#dceeff]">
                <div
                  className="h-full rounded-[5px] bg-[#308cf9]"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const SchedulingDashboardSection = (): JSX.Element => {
  const [view, setView] = useState("Week");
  const [confirmedEvents, setConfirmedEvents] = useState<any[]>([]);

  useEffect(() => {
    void supabase.rpc("get_professional_calendar_events").then(({ data, error }) => {
      if (!error && data) {
        setConfirmedEvents(
          data.filter(
            (item) =>
              item.appointment_date >= "2026-09-21" &&
              item.appointment_date <= "2026-09-27",
          ),
        );
      }
    });
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[1296px] flex-col gap-2 px-1 py-1 font-['Inter',Helvetica] text-[#012878]">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(value) => value && setView(value)}
          className="flex flex-wrap justify-start gap-2"
        >
          {viewOptions.map((option, index) => (
            <ToggleGroupItem
              key={option.label}
              value={option.label}
              disabled={option.disabled}
              className={`h-11 w-[111px] rounded-[10px] border-2 border-solid border-[#012878] bg-white text-sm font-normal text-[#012878] shadow-[0px_2px_8px_#308cf940] data-[state=on]:bg-[#308cf9] data-[state=on]:text-white disabled:opacity-45 ${
                index === 4 ? "text-xs" : ""
              }`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button
          type="button"
          variant="outline"
          className={`h-10 w-[81.75px] shrink-0 rounded-xl border-2 ${border} bg-[#ffffffd1] px-2.5 text-sm ${navy}`}
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
      <nav aria-label="Service categories" className="grid gap-2">
        {serviceRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2.5">
            {row.map((service) => (
              <Button
                key={service}
                type="button"
                variant="outline"
                className={`h-11 min-w-0 rounded-[10px] border-2 ${border} bg-[#ffffffeb] px-2 text-center text-[12px] font-medium ${navy} shadow-[0px_2px_6px_#308cf91f]`}
              >
                <span className="truncate">{service}</span>
              </Button>
            ))}
          </div>
        ))}
      </nav>
      <Card className={`${panel} rounded-[14px] overflow-hidden`}>
        <CardContent className="p-2.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              aria-label="Previous week"
              className="h-8 w-8 rounded-[10px] border-[1.5px] border-[#308cf9] p-0 text-[#012878] sm:h-11 sm:w-11"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-normal sm:text-xl">
              Sep 21–27, 2026
            </span>
            <Button
              type="button"
              variant="outline"
              aria-label="Next week"
              className="h-8 w-8 rounded-[10px] border-[1.5px] border-[#308cf9] p-0 text-[#012878] sm:h-11 sm:w-11"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2 text-[10px] font-medium text-[#012878] sm:h-11 sm:text-sm"
            >
              Today 21
            </Button>
          </div>
          <div className="grid min-w-[700px] grid-cols-7 overflow-hidden border border-[#012878]">
            {days.map((item, index) => (
              <div
                key={item.date}
                className={`relative min-h-[250px] border-r border-[#012878] last:border-r-0 ${
                  item.selected ? "bg-[#dceeff73]" : "bg-[#ffffff03]"
                }`}
              >
                <div className="flex h-12 flex-col items-center justify-center gap-0.5 border-b border-[#012878]">
                  <span className="text-[10px] text-[#308cf9] sm:text-xs">
                    {item.day}
                  </span>
                  <span className="text-xs text-[#012878] sm:text-[15px]">
                    {item.date}
                  </span>
                </div>
                {item.badge && (
                  <div className="absolute left-1/2 top-[63px] flex -translate-x-1/2 items-center gap-1">
                    <span className="flex h-6 w-[34px] items-center justify-center rounded-[7px] border-[1.5px] border-[#308cf9] bg-[#dceeff] text-[11px]">
                      {item.badge}
                    </span>
                    {item.warning && (
                      <img
                        src="https://c.animaapp.com/ap7wB-tyOVOiHRyRMeGUgg/img/time-conflict-warning.svg"
                        alt="Time conflict"
                        className="h-[11.25px] w-[12.99px]"
                      />
                    )}
                  </div>
                )}

                {confirmedEvents
                  .filter((event) => {
                    return event.appointment_date === `2026-09-${item.date}`;
                  })
                  .map((event) => (
                    <article
                      key={event.id}
                      className="absolute left-1 right-1 top-[145px] rounded-lg border border-[#bfcce0] bg-[#f7f9ff] p-1 text-[7px] leading-tight text-black sm:text-[9px]"
                    >
                      <div>{event.service_type}</div>
                      <div>{event.reference}</div>
                      <div>{event.appointment_date} · {event.appointment_arrival_time?.slice(0, 5)}</div>
                      <div>Confirmed</div>
                    </article>
                  ))}
                {events
                  .filter((event) => event.day === index)
                  .map((event) => (
                    <article
                      key={event.id}
                      className="absolute left-1 right-1 top-[63px] rounded-lg border border-[#bfcce0] bg-[#f7f9ff] p-1 text-[7px] leading-tight text-black sm:text-[9px]"
                    >
                      <div>{event.title}</div>
                      <div>{event.id}</div>
                      <div>{event.date}</div>
                      <div>{event.status}</div>
                    </article>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className={`${panel} rounded-[14px] overflow-hidden`}>
        <CardContent className="grid grid-cols-[1fr_220px] gap-2 p-1.5">
          <section>
            <div className="px-1 text-[15px]">
              Occupancy — Sep 21–27, 2026
            </div>
            <div className="mt-1 grid grid-cols-[135px_repeat(7,minmax(36px,1fr))] items-center gap-2 text-[9.5px]">
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-[11px]">
                  <i className="h-3 w-3 rounded-[3px] border border-[#308cf959] bg-[#dceeff]" />
                  Free
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#308cf9]">
                  <i className="h-3 w-3 rounded-[3px] bg-[#308cf9]" />
                  Busy
                </span>
              </div>
              {occupancyDays.map((day) => (
                <div key={day.date} className="text-center">
                  <div>{day.date}</div>
                  <div className="mt-1 h-2 rounded-[3px] bg-[#dceeff]" />
                  <div
                    className={`mt-2 h-2 rounded-[3px] ${
                      day.pm === "busy" ? "bg-[#308cf9]" : "bg-[#dceeff]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border-2 border-solid border-[#012878] px-3 text-[11px]">
            <div className="text-center">Occupancy</div>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex h-7 w-[18px] flex-col overflow-hidden rounded-lg border border-[#308cf980]">
                <div className="flex-1 bg-[#dceeff]" />
                <div className="h-0.5 bg-[#308cf9]" />
              </div>
              <div className="leading-[17px]">
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
        items={plannedItems}
      />
      <TimeSummary
        title="Actual Time — Sep 21–27, 2026"
        total="Total: 0 h"
        items={actualItems}
      />

      <section className="grid gap-2 lg:grid-cols-[455px_435px_1fr]">
        <Card className={`${panel} rounded-[14px]`}>
          <CardContent className="p-2">
            <h2 className="mb-2 text-lg font-normal">Availability</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {["Free Day", "Busy Day", "Free PM", "Free AM"].map(
                (label, index) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    className={`${softPanel} h-7 justify-start gap-2 rounded-[10px] px-1 text-xs font-normal ${navy}`}
                  >
                    <span
                      className={`h-[18px] w-[18px] rounded-full border-2 border-[#308cf9] ${
                        index === 0 ? "bg-[#308cf9]" : "bg-white"
                      }`}
                    />
                    {label}
                  </Button>
                ),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className={`${panel} rounded-[14px]`}>
          <CardContent className="p-4">
            <h2 className="mb-2 text-base font-normal">Reminders</h2>
            <div className="grid grid-cols-3 gap-1.5">
              {["1 hour before", "1 day before", "+ Add"].map((label) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  className={`${softPanel} h-10 rounded-[10px] px-1 text-[10px] font-medium ${navy} sm:text-xs`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={`${panel} rounded-[14px]`}>
          <CardContent className="flex flex-col gap-1.5 p-4 text-sm">
            <h2 className="text-base font-normal">Doors</h2>
            <div className="font-medium">MYB-S26-583742</div>
            <div>16.09.2026 • близько 5:30 PM</div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
