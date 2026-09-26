import { ProfessionalNavigationSection } from "./sections/ProfessionalNavigationSection";
import { SchedulingDashboardSection } from "./sections/SchedulingDashboardSection";
import { WorkOrderStatusSection } from "./sections/WorkOrderStatusSection";

export const ServiceCalendarV2 = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full overflow-x-auto bg-slate-100 [background:url(https://c.animaapp.com/ap7wB-tyOVOiHRyRMeGUgg/img/background-test.png)_50%_50%_/_cover]">
      <div className="grid min-h-screen w-full min-w-[768px] grid-cols-[9%_minmax(0,1fr)]">
        <aside className="flex min-h-screen flex-col items-center gap-2.5 px-1.5 py-3">
          <img
            className="ml-3 h-6 w-6 shrink-0 self-start object-contain"
            alt="Myblif logo compact"
            src="https://c.animaapp.com/ap7wB-tyOVOiHRyRMeGUgg/img/myblif-logo---compact-shell.png"
          />
          <nav
            aria-label="Professional navigation"
            className="flex h-[81vh] flex-none items-stretch justify-center"
          >
            <ProfessionalNavigationSection />
          </nav>
        </aside>
        <main className="flex min-h-screen min-w-0 flex-col gap-1 pt-3 pr-2">
          <header className="shrink-0">
            <WorkOrderStatusSection />
          </header>
          <section aria-label="Scheduling dashboard" className="min-h-0 flex-1">
            <SchedulingDashboardSection />
          </section>
        </main>
      </div>
    </div>
  );
};
