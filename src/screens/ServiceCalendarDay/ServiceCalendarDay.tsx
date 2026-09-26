import { ProfessionalNavigationSection } from "./sections/ProfessionalNavigationSection";
import { SchedulingDashboardSection } from "./sections/SchedulingDashboardSection";
import { WorkflowStatusSection } from "./sections/WorkflowStatusSection";

export const ServiceCalendarDay = (): JSX.Element => {
  return (
    <main
      className="min-h-screen w-full overflow-x-auto bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/background-test.png)",
      }}
    >
      <div className="grid min-h-screen w-full grid-cols-[1%_7%_1%_90%_1%] grid-rows-[2vh_5vh_1vh_92vh]">
        <header className="col-span-3 row-span-3 flex items-center justify-center">
          <img
            className="h-12 w-12 shrink-0 object-contain"
            alt="Myblif logo compact"
            src="https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/myblif-logo---compact-shell.png"
          />
        </header>
        <section
          className="col-start-4 row-start-2 min-w-0"
          aria-label="Workflow status"
        >
          <WorkflowStatusSection />
        </section>
        <aside
          className="col-start-2 row-start-4 h-[81vh] min-h-0"
          aria-label="Professional navigation"
        >
          <ProfessionalNavigationSection />
        </aside>
        <section
          className="col-start-4 row-start-4 min-h-0 min-w-0"
          aria-label="Scheduling dashboard"
        >
          <SchedulingDashboardSection />
        </section>
      </div>
    </main>
  );
};
