import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CustomerContactSection } from "./sections/CustomerContactSection";
import { CustomerMediaSection } from "./sections/CustomerMediaSection";
import { EstimateManagementSection } from "./sections/EstimateManagementSection";
import { MainNavigationSection } from "./sections/MainNavigationSection";
import { ReminderSchedulingSection } from "./sections/ReminderSchedulingSection";
import { ServiceRequestDescriptionSection } from "./sections/ServiceRequestDescriptionSection";
import { TechnicianAvailabilitySection } from "./sections/TechnicianAvailabilitySection";
import { TechnicianChatSection } from "./sections/TechnicianChatSection";
import { WorkOrderDetailsSection } from "./sections/WorkOrderDetailsSection";
import { WorkOrderStatusSection } from "./sections/WorkOrderStatusSection";

const workOrder = {
  title: "Automatic Door Repair",
  reference: "MYB-S26-583742",
  received: "Received Sep 16, 2026",
};

export const ServiceOrder = (): JSX.Element => {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://c.animaapp.com/a6pmK9CE_VYa_kCXqMQRGw/img/background-test.png)",
      }}
    >
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[54px_minmax(0,1fr)] gap-x-4 px-2 py-2 lg:grid-cols-[54px_minmax(0,1fr)]">
        <aside className="row-span-2 flex flex-col items-center gap-3">
          <img
            className="h-12 w-12 shrink-0 object-contain"
            alt="Myblif logo compact"
            src="https://c.animaapp.com/a6pmK9CE_VYa_kCXqMQRGw/img/myblif-logo---compact-shell.png"
          />
          <nav aria-label="Main navigation" className="min-h-0 flex-1">
            <MainNavigationSection />
          </nav>
        </aside>
        <section className="min-w-0">
          <div className="mb-2">
            <WorkOrderStatusSection />
          </div>
          <div className="flex items-start justify-between gap-4 px-1">
            <div className="min-w-0">
              <h1 className="[font-family:'Inter',Helvetica] text-[28px] font-normal leading-none tracking-normal text-[#012878]">
                {workOrder.title}
              </h1>
              <p className="[font-family:'Inter',Helvetica] text-sm font-extrabold leading-5 text-[#5e6e85]">
                {workOrder.reference}
                <span className="px-2">•</span>
                {workOrder.received}
              </p>
            </div>
            <Select defaultValue="EN">
              <SelectTrigger
                aria-label="Language"
                className="h-10 w-20 shrink-0 rounded-xl border-2 border-[#012878] bg-white/80 px-2 text-[#012878]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">🌐 EN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-[minmax(88px,0.29fr)_minmax(0,1fr)_minmax(220px,0.72fr)] sm:grid-rows-[auto_auto_auto_auto]">
            <section className="min-w-0 sm:row-span-2">
              <CustomerMediaSection />
            </section>
            <section className="min-w-0">
              <WorkOrderDetailsSection />
            </section>
            <section className="min-w-0 sm:row-span-1">
              <CustomerContactSection />
            </section>
            <section className="min-w-0">
              <ServiceRequestDescriptionSection />
            </section>
            <section className="min-w-0 sm:row-span-2">
              <EstimateManagementSection />
            </section>
            <section className="min-w-0 sm:col-start-2 sm:row-span-2">
              <TechnicianChatSection />
            </section>
            <section className="min-w-0">
              <TechnicianAvailabilitySection />
            </section>
            <section className="min-w-0">
              <ReminderSchedulingSection />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
