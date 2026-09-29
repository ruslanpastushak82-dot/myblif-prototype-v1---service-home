import { ProfessionalShell } from "../../components/ProfessionalShell/ProfessionalShell";
import { SchedulingDashboardSection } from "./sections/SchedulingDashboardSection";

export const ServiceCalendar = (): JSX.Element => {
  return (
    <ProfessionalShell activeNavItem="Calendar">
      <SchedulingDashboardSection />
    </ProfessionalShell>
  );
};
