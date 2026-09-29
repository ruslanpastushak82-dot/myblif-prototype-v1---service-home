import { ProfessionalShell } from "../../components/ProfessionalShell/ProfessionalShell";
import { OrdersManagementSection } from "./sections/OrdersManagementSection";

export const ServiceProfessional = (): JSX.Element => {
  return (
    <ProfessionalShell activeNavItem="Orders">
      <OrdersManagementSection />
    </ProfessionalShell>
  );
};
