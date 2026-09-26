import { JobStatusSummarySection } from "./sections/JobStatusSummarySection";
import { ProfessionalNavigationSidebarSection } from "./sections/ProfessionalNavigationSidebarSection";
import { SchedulingDashboardSection } from "./sections/SchedulingDashboardSection";

export const ServiceCalendar = (): JSX.Element => {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://c.animaapp.com/g0hxWhi-_XcFFGB69NxFCA/img/background-test.png)",
      }}
    >
      <div className="grid min-h-screen w-full grid-cols-[1%_7%_1%_90%_1%] grid-rows-[1%_5%_2%_92%]">
        <div className="col-start-2 row-span-3 flex items-start justify-center pt-[7px]">
          <img
            className="h-6 w-6 object-contain"
            alt="Myblif logo compact"
            src="https://c.animaapp.com/g0hxWhi-_XcFFGB69NxFCA/img/myblif-logo---compact-shell.png"
          />
        </div>
        <header className="col-start-4 row-start-2 min-w-0">
          <JobStatusSummarySection />
        </header>
        <aside className="col-start-2 row-start-4 min-w-0">
          <ProfessionalNavigationSidebarSection />
        </aside>
        <section className="col-start-4 row-start-4 min-w-0">
          <SchedulingDashboardSection />
        </section>
      </div>
    </main>
  );
};
