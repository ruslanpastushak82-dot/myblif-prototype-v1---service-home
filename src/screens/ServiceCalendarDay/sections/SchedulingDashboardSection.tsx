import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";

const navy = "text-[#012878]";
const border = "border-[#012878]";
const panel =
  "rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]";

const views = ["Day", "Week", "Month", "Today", "Upcoming", "Deadlines"];

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
  { label: "Mon 21", active: false },
  { label: "Tue 22", active: true },
  { label: "Wed 23", active: false },
  { label: "Thu 24", active: false },
  { label: "Fri 25", active: false },
  { label: "Sat 26", active: false },
  { label: "Sun 27", active: false, sunday: true },
];

const periods = [
  {
    title: "MORNING",
    times: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
  },
  {
    title: "AFTERNOON",
    times: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  },
];

const occupancyDays = [
  { day: "21", am: "free", pm: "free" },
  { day: "22", am: "free", pm: "busy" },
  { day: "23", am: "busy", pm: "free" },
  { day: "24", am: "free", pm: "busy" },
  { day: "25", am: "free", pm: "free" },
  { day: "26", am: "free", pm: "free" },
  { day: "27", am: "free", pm: "free" },
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

const availability = [
  { label: "Free Day", selected: true, position: "left" },
  { label: "Free AM", selected: false, position: "right" },
  { label: "Busy Day", selected: false, position: "left" },
  { label: "Free PM", selected: false, position: "right" },
];

type TimelineEvent = {
  time: string;
  title: string;
  subtitle: string;
};

function TimelinePeriod({
  title,
  times,
  events = [],
}: {
  title: string;
  times: string[];
  events?: TimelineEvent[];
}): JSX.Element {
  return (
    <section className="min-w-0 flex-1 rounded-md bg-[#fbfcff] px-3 pt-2">
      <h3 className="mb-1 text-[10px] font-normal uppercase text-[#012878] opacity-65">
        {title}
      </h3>
      <div className="grid h-[285px] grid-rows-7">
        {times.map((time) => {
          const event = events.find((item) => item.time === time);

          return (
            <div
              key={time}
              className="relative grid grid-cols-[42px_1fr] items-center gap-2 text-[10px] text-[#012878] opacity-70"
            >
              <span>{time}</span>
              <span className="h-px bg-[#012878]" />
              {event && (
                <div className="pointer-events-none absolute left-[50px] top-full z-10 flex w-[209px] -translate-y-1/2 flex-col gap-0.5 rounded-[10px] border-[1.5px] border-solid border-[#0a3f9e] bg-[#f4f9ff] px-3 py-0 text-[11px] text-black shadow-[0px_2px_8px_#308cf940]">
                  <span className="text-xs">{event.title}</span>
                  <span>{event.subtitle}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

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
          <h2>{title}</h2>
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
  const [selectedView, setSelectedView] = useState("Day");

  return (
    <main className="mx-auto flex w-full max-w-[1296px] flex-col gap-2 px-1 py-1 font-['Inter',Helvetica] text-[#012878]">
      <header className="flex items-start justify-between gap-2">
        <ToggleGroup
          type="single"
          value={selectedView}
          onValueChange={(value) => value && setSelectedView(value)}
          className="flex flex-wrap justify-start gap-2"
        >
          {views.map((view, index) => (
            <ToggleGroupItem
              key={view}
              value={view}
              disabled={index > 2}
              className={`h-11 w-[111px] rounded-[10px] border-2 border-solid border-[#012878] bg-white text-sm font-normal text-[#012878] shadow-[0px_2px_8px_#308cf940] data-[state=on]:bg-[#308cf9] data-[state=on]:text-white disabled:opacity-45 ${
                index === 4 ? "text-xs" : ""
              }`}
            >
              {view}
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
      <Card className={`${panel} overflow-hidden`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              aria-label="Previous day"
              className={`h-11 w-11 rounded-[10px] border-[1.5px] ${border} bg-[#ffffffeb] p-0 text-lg ${navy}`}
            >
              ←
            </Button>
            <h1 className="text-xl font-normal">September 22, 2026</h1>
            <Button
              type="button"
              variant="outline"
              aria-label="Next day"
              className={`h-11 w-11 rounded-[10px] border-[1.5px] ${border} bg-[#ffffffeb] p-0 text-lg ${navy}`}
            >
              →
            </Button>
            <span className="flex-1" />
            <Button
              type="button"
              variant="outline"
              className={`h-11 rounded-[10px] border-2 ${border} bg-[#ffffffeb] px-[18px] text-sm font-medium ${navy}`}
            >
              Today 21
            </Button>
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-2.5">
            {days.map((day) => (
              <div
                key={day.label}
                className={`flex h-7 items-center justify-center rounded-lg text-xs font-medium ${
                  day.active
                    ? "border-2 border-[#1e7cf4]"
                    : day.sunday
                      ? "bg-[#dceeff73] text-[#012878]"
                      : ""
                } text-[#308cf9]`}
              >
                {day.label}
              </div>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-2.5 overflow-hidden rounded-[10px] border border-solid border-[#012878] bg-[#fffffff0] p-1">
            {periods.map((period) => (
              <TimelinePeriod
                key={period.title}
                title={period.title}
                times={period.times}
                events={
                  period.title === "MORNING"
                    ? [
                        {
                          time: "09:00",
                          title: "Plumbing · MYB-S26-328641",
                          subtitle: "09:30 · Rework",
                        },
                      ]
                    : undefined
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className={`${panel} overflow-hidden`}>
        <CardContent className="grid grid-cols-[1fr_220px] gap-2 p-1.5">
          <section>
            <h2 className="px-1 text-[15px]">Occupancy — Sep 21–27, 2026</h2>
            <div className="mt-1 grid grid-cols-[190px_repeat(7,1fr)] items-center gap-2 text-[9.5px]">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span>◼ Free</span>
                <span className="text-[#308cf9]">◼ Busy</span>
              </div>
              {occupancyDays.map((day) => (
                <div key={day.day} className="text-center">
                  <div>{day.day}</div>
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
            <h2 className="text-center">Occupancy</h2>
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
      <div className="grid grid-cols-[455px_435px_1fr] gap-2">
        <Card className={panel}>
          <CardContent className="p-2">
            <h2 className="mb-2 px-3 text-lg">Availability</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {availability.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="outline"
                  className={`h-7 justify-start gap-2.5 rounded-[10px] border-2 ${border} px-1.5 text-[15px] font-normal ${navy}`}
                >
                  <span
                    className={`h-[18px] w-[18px] rounded-full border-2 border-[#308cf9] ${
                      item.selected ? "bg-[#308cf9]" : "bg-white"
                    }`}
                  />
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={panel}>
          <CardContent className="p-4">
            <h2 className="mb-3 text-base">Reminders</h2>
            <div className="grid grid-cols-3 gap-2">
              {["1 hour before", "1 day before", "+ Add"].map((reminder) => (
                <Button
                  key={reminder}
                  type="button"
                  variant="outline"
                  className={`h-10 rounded-[10px] border-2 ${border} bg-[#ffffffeb] px-2 text-sm font-medium ${navy}`}
                >
                  {reminder}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={panel}>
          <CardContent className="flex flex-col gap-1.5 p-4">
            <h2 className="text-base">Plumbing</h2>
            <p className="text-sm font-medium">MYB-S26-328641</p>
            <p className="text-sm">22.09.2026 • 09:30</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
