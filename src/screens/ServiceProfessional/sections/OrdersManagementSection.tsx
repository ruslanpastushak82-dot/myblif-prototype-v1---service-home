import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { supabase } from "../../../lib/supabase";
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
import type { ProfessionalWorkflowStatus } from "../../../state/CustomerRequestContext";
import type { OperatingFilterKey } from "../../../components/ProfessionalShell/operatingFilterData";


// Layout template: Calendar Day's SchedulingDashboardSection.tsx, verbatim
// values copied 1:1 (not Calendar Month). Same navy/border/panel tokens.
const navy = "text-[#012878]";
const border = "border-[#012878]";
const panel =
  "rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]";

// Same control classes as Calendar Day's own view-switcher ToggleGroupItem
// (Day/Week/Month/Today/Upcoming/Deadlines) — reused as-is, not reinvented.
const controlClass = `h-11 w-[111px] rounded-[10px] border-2 border-solid ${border} bg-white text-sm font-normal ${navy} shadow-[0px_2px_8px_#308cf940] data-[state=on]:bg-[#308cf9] data-[state=on]:text-white disabled:opacity-45`;

type OrderRow = {
  key: string;
  number: string;
  service: string;
  stage: string;
  nextAction: string;
  deadline: string;
  progress: string;
  onOpen: () => void;
};

// Original Stage 1 mock orders — kept exactly as they were (Stage 2A: "не
// видаляй поточні mock orders"). Their own "Open order" action is
// unchanged too: it goes to the existing, unparameterized /service-order,
// same as before this stage (that route still renders its own Stage 1
// hardcoded mock work order).
const mockOrders: Omit<OrderRow, "onOpen">[] = [
  {
    key: "mock-1",
    number: "MYB-S26-583742",
    service: "Door Repair",
    stage: "Service",
    nextAction: "Confirming Time",
    deadline: "—",
    progress: "—",
  },
  {
    key: "mock-2",
    number: "MYB-S26-328641",
    service: "Plumbing",
    stage: "Revision",
    nextAction: "17 → 22 Sep · 09:30",
    deadline: "22 Sep 2026",
    progress: "—",
  },
  {
    key: "mock-3",
    number: "MYB-S26-714205",
    service: "Garage Doors",
    stage: "Rescheduled",
    nextAction: "19 → 23 Sep · 10:00",
    deadline: "23 Sep 2026",
    progress: "—",
  },
  {
    key: "mock-4",
    number: "MYB-S26-905317",
    service: "Welding",
    stage: "Scheduled",
    nextAction: "In Progress · 24 Sep · 13:00",
    deadline: "24 Sep 2026",
    progress: "—",
  },
  {
    key: "mock-5",
    number: "MYB-S26-462893",
    service: "Caulking & Sealing",
    stage: "Declined",
    nextAction: "Declined · 19 Sep",
    deadline: "19 Sep 2026",
    progress: "—",
  },
];

// Display labels for the Professional lifecycle (Stage 2A §6) — a
// deliberately separate vocabulary from both the Customer-facing
// RequestStatus and the mock rows' own "stage" strings above. No mapping
// between them is invented here.
const professionalStatusLabels: Record<ProfessionalWorkflowStatus, string> = {
  new_order: "New Order",
  under_review: "Under Review",
  awaiting_response: "Awaiting Response",
  approved: "Approved",
  completed: "Completed",
};

const filterOptions = ["Order Number", "Address", "Client", "Stage", "Sort"];

// Fixed geometry for the Orders content card at 1440x1024:
// Card bottom is targeted to align with the Sidebar/Profile bottom edge
// (measured nav bottom at this viewport), and row height is sized so the
// card's vertical capacity holds 7 full rows (with a 4px gap between
// cards) even though only 5 real prototype orders exist today. The
// leftover space below the 5th row is intentionally left empty.
const CARD_HEIGHT = 767; // px — matches Sidebar nav bottom at 1440x1024
const ROW_HEIGHT = 88; // px — 7 rows + 6x4px gaps fit inside CARD_HEIGHT
const ROW_GAP = 4; // px

export const OrdersManagementSection = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState("All Orders");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [operatingFilter, setOperatingFilter] = useState<OperatingFilterKey | null>(null);
  const navigate = useNavigate();
  const [backendOrders, setBackendOrders] = useState<Array<{
    id: string;
    reference: string;
    service_type: string;
    professional_status: ProfessionalWorkflowStatus;
    critical: boolean;
  }>>([]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      const { data, error } = await supabase.rpc("get_service_orders_safe");
      if (!active || error || !data) return;

      setBackendOrders(
        data.map((item) => ({
          id: item.id,
          reference: item.reference,
          service_type: item.service_type,
          professional_status: item.professional_status,
          critical: Boolean(item.critical),
        })),
      );
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleOperatingFilter = (event: Event) => {
      const next = (event as CustomEvent<OperatingFilterKey | null>).detail;
      setOperatingFilter(next);
      if (next) setSelectedTab("All Orders");
    };
    window.addEventListener("myblif:operating-filter", handleOperatingFilter);
    return () => {
      window.removeEventListener("myblif:operating-filter", handleOperatingFilter);
    };
  }, []);

  // Real Customer-submitted orders, newest last (submission order) — kept
  // append-only after the 5 existing mock rows, per Stage 2A §2 ("не
  // видаляй поточні mock orders"). Only real fields the Customer actually
  // has are shown (service type, reference, lifecycle stage); Next
  // Action/Deadline/Progress have no real source yet (no Appointment/
  // Estimate at this stage), so they're left as "—" rather than invented.
  const realOrders: OrderRow[] = useMemo(
    () =>
      backendOrders
        .filter((item) => {
          if (selectedTab === "Active" && item.professional_status === "completed") {
            return false;
          }
          if (selectedTab === "Completed" && item.professional_status !== "completed") {
            return false;
          }
          if (!operatingFilter) return true;
          if (operatingFilter === "critical") return item.critical;
          const statusByFilter: Record<Exclude<OperatingFilterKey, "critical">, ProfessionalWorkflowStatus> = {
            newOrders: "new_order",
            underReview: "under_review",
            awaitingResponse: "awaiting_response",
            approved: "approved",
            completed: "completed",
          };
          return item.professional_status === statusByFilter[operatingFilter];
        })
        .map((item) => ({
        key: item.reference ?? item.id ?? "unknown",
        number: item.reference ?? "—",
        service: item.service_type,
        stage: item.professional_status
          ? professionalStatusLabels[item.professional_status]
          : "—",
        nextAction: "—",
        deadline: "—",
        progress: "—",
        onOpen: () => {
          if (!item.reference) return;
          navigate(`/service-order/${item.reference}`);
        },
      })),
    [backendOrders, navigate, operatingFilter, selectedTab],
  );

  const rows: OrderRow[] = [
    ...mockOrders.map((order) => ({
      ...order,
      onOpen: () => navigate("/service-order"),
    })),
    ...realOrders,
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1296px] flex-col gap-2 px-1 py-1 font-['Inter',Helvetica] text-[#012878]">
      {/*
        Same row as Calendar Day's <header>: no flex-wrap on the header
        itself (Day has none), controls on the left, EN on the right, same
        justify-between axis. The controls slot reuses Day's own
        ToggleGroup wrapper classes (flex flex-wrap justify-start gap-2).
      */}
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap justify-start gap-2">
          <ToggleGroup
            type="single"
            value={selectedTab}
            onValueChange={(value) => {
              if (value) {
                setSelectedTab(value);
              }
            }}
            className="flex flex-wrap justify-start gap-2"
            aria-label="Orders view"
          >
            {["All Orders", "Active", "Completed"].map((tab) => (
              <ToggleGroupItem
                key={tab}
                value={tab}
                aria-label={`${tab} view`}
                className={controlClass}
              >
                <span className="truncate px-1">{tab}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {filterOptions.map((filter) => (
            <DropdownMenu key={filter}>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className={controlClass}>
                  <span className="truncate px-1">{filter}</span>
                  <ChevronDownIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setSelectedFilter(filter)}>
                  {filter}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className={`h-10 w-[81.75px] shrink-0 rounded-xl border-2 ${border} bg-[#ffffffd1] px-2.5 text-sm ${navy}`}
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

      {/* Same hairline divider Calendar Day renders right below its header. */}
      <div className="h-px w-full bg-[#308cf959]" />

      {/*
        Calendar Day's two service-category button rows are removed
        entirely for Orders — this space is intentionally left empty.
      */}

      {/*
        Same big content Card Calendar Day uses for its day/timeline
        panel: identical panel classes, identical left/right boundaries
        and identical CardContent padding (p-3). Only the vertical
        geometry changes here: the card is extended down to the
        Sidebar/Profile bottom edge, and order rows are shorter so 7 full
        rows fit in that height.
      */}
      <Card
        className={`${panel} overflow-hidden`}
        style={{ height: `${CARD_HEIGHT}px` }}
      >
        <CardContent className="flex h-full min-h-0 flex-col p-3">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-xl font-normal">Orders</h1>
          </div>
          <div className="min-h-0 flex-1 overflow-x-auto overflow-y-scroll overscroll-contain pr-1">
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
              <div
                className="flex flex-col"
                style={{ gap: `${ROW_GAP}px` }}
              >
                {rows.map((order) => (
                  <article
                    key={order.key}
                    onClick={order.onOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        order.onOpen();
                      }
                    }}
                    className="grid cursor-pointer grid-cols-[1.25fr_1fr_1fr_2fr_1.2fr_0.8fr_24px] items-center gap-5 rounded-xl border-2 border-[#012878] bg-white px-3 text-sm text-slate-800 [font-family:'Inter',Helvetica]"
                    style={{ height: `${ROW_HEIGHT}px` }}
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
                      onClick={(event) => {
                        event.stopPropagation();
                        order.onOpen();
                      }}
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
          <footer className="px-3 pt-2 text-[13px] text-slate-500 [font-family:'Inter',Helvetica]">
            {rows.length} orders
          </footer>
        </CardContent>
      </Card>
    </main>
  );
};
