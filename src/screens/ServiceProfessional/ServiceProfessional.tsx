import { ApplicationNavigationSection } from "./sections/ApplicationNavigationSection";
import { OrderStatusSummarySection } from "./sections/OrderStatusSummarySection";
import { OrdersManagementSection } from "./sections/OrdersManagementSection";

const backgroundImage =
  "url(https://c.animaapp.com/I0GZ-jEdYsqJttTJa8RIUw/img/background-test.png)";

const logoSrc =
  "https://c.animaapp.com/I0GZ-jEdYsqJttTJa8RIUw/img/myblif-logo---compact-shell.png";

export const ServiceProfessional = (): JSX.Element => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage }}
    >
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[7%_1%_minmax(0,1fr)] grid-rows-[5%_2%_minmax(0,1fr)] p-[1%]">
        <img
          className="absolute left-[2%] top-[1%] z-10 h-6 w-6 object-contain"
          src={logoSrc}
          alt="Myblif logo compact"
        />
        <aside
          className="col-start-1 row-start-3 min-w-0"
          aria-label="Application navigation"
        >
          <ApplicationNavigationSection />
        </aside>
        <section
          className="col-start-3 row-start-1 min-w-0"
          aria-label="Order status summary"
        >
          <OrderStatusSummarySection />
        </section>
        <main
          className="col-start-3 row-start-3 min-h-0 min-w-0"
          aria-label="Orders management"
        >
          <OrdersManagementSection />
        </main>
      </div>
    </div>
  );
};
