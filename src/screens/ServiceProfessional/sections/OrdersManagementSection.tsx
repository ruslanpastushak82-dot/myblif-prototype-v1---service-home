import { ChevronDownIcon, ChevronRightIcon, Globe2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";

type Order = {
  number: string;
  service: string;
  stage: string;
  nextAction: string;
  deadline: string;
  progress: string;
};

const orders: Order[] = [
  {
    number: "MYB-S26-583742",
    service: "Door Repair",
    stage: "Service",
    nextAction: "Confirming Time",
    deadline: "—",
    progress: "—",
  },
  {
    number: "MYB-S26-328641",
    service: "Plumbing",
    stage: "Revision",
    nextAction: "17 → 22 Sep · 09:30",
    deadline: "22 Sep 2026",
    progress: "—",
  },
  {
    number: "MYB-S26-714205",
    service: "Garage Doors",
    stage: "Rescheduled",
    nextAction: "19 → 23 Sep · 10:00",
    deadline: "23 Sep 2026",
    progress: "—",
  },
  {
    number: "MYB-S26-905317",
    service: "Welding",
    stage: "Scheduled",
    nextAction: "In Progress · 24 Sep · 13:00",
    deadline: "24 Sep 2026",
    progress: "—",
  },
  {
    number: "MYB-S26-462893",
    service: "Caulking & Sealing",
    stage: "Declined",
    nextAction: "Declined · 19 Sep",
    deadline: "19 Sep 2026",
    progress: "—",
  },
];

const filterOptions = ["Order Number", "Address", "Client", "Stage", "Sort"];

export const OrdersManagementSection = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState("All Orders");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  return (
    <section className="w-full px-4 py-5 sm:px-8 lg:px-16">
      <Card className="mx-auto w-full max-w-[1296px] overflow-hidden rounded-[14px] border-2 border-[#308cf9] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]">
        <CardContent className="p-0">
          <header className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#308cf9a6] px-5 py-3">
            <h1 className="[font-family:'Inter',Helvetica] text-2xl font-normal leading-none text-[#012878]">
              Orders
            </h1>
            <div className="flex flex-1 flex-wrap items-center justify-start gap-1.5 lg:justify-end">
              <ToggleGroup
                type="single"
                value={selectedTab}
                onValueChange={(value) => {
                  if (value) {
                    setSelectedTab(value);
                  }
                }}
                className="flex flex-wrap justify-start gap-1.5"
              >
                {["All Orders", "Active", "Completed"].map((tab) => (
                  <ToggleGroupItem
                    key={tab}
                    value={tab}
                    className="h-11 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-xs font-medium text-[#012878] shadow-[0px_2px_6px_#308cf91f] data-[state=on]:bg-[#308cf9] data-[state=on]:text-white"
                  >
                    {tab}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {filterOptions.map((filter) => (
                <DropdownMenu key={filter}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-xs font-medium text-[#012878] shadow-[0px_2px_6px_#308cf91f]"
                    >
                      {selectedFilter === filter ? filter : filter}
                      <ChevronDownIcon
                        className="ml-1 h-3 w-3"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onSelect={() => setSelectedFilter(filter)}
                    >
                      {filter}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2.5 text-base font-bold text-[#012878]"
              aria-label="Change language"
            >
              <Globe2Icon className="mr-1.5 h-4 w-4" aria-hidden="true" />
              <span>EN</span>
              <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </header>
          <div className="overflow-x-auto px-5 pb-3 pt-4">
            <div className="min-w-[1000px]">
              <div
                className="grid grid-cols-[1.25fr_1fr_1fr_2fr_1.2fr_0.8fr_24px] gap-5 px-3 pb-3 text-xs text-slate-500 [font-family:'Inter',Helvetica]"
                role="row"
              >
                <div role="columnheader">Orders</div>
                <div role="columnheader">Service</div>
                <div role="columnheader">Stage</div>
                <div role="columnheader">Next Action</div>
                <div role="columnheader">Deadline</div>
                <div role="columnheader">Progress</div>
                <div role="columnheader" aria-label="Open order" />
              </div>
              <div className="space-y-0">
                {orders.map((order) => (
                  <article
                    key={order.number}
                    className="grid min-h-[108px] grid-cols-[1.25fr_1fr_1fr_2fr_1.2fr_0.8fr_24px] items-start gap-5 rounded-xl border-2 border-[#012878] bg-white px-3 py-6 text-sm text-slate-800 [font-family:'Inter',Helvetica] [&+article]:mt-0"
                  >
                    <div className="font-normal text-[#012878]">
                      {order.number}
                    </div>
                    <div>{order.service}</div>
                    <div>{order.stage}</div>
                    <div>{order.nextAction}</div>
                    <div>{order.deadline}</div>
                    <div className="text-[#012878]">{order.progress}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto justify-start p-0 text-[#308cf9] hover:bg-transparent hover:text-[#308cf9]"
                      aria-label={`Open order ${order.number}`}
                    >
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <footer className="px-5 pb-4 text-[13px] text-slate-500 [font-family:'Inter',Helvetica]">
            {orders.length} orders
          </footer>
        </CardContent>
      </Card>
    </section>
  );
};
