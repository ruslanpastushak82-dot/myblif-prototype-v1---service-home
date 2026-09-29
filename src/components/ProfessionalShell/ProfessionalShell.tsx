import { ReactNode } from "react";
import { OperatingFilterBar } from "./OperatingFilterBar";
import {
  ProfessionalNavItemKey,
  ProfessionalSidebar,
} from "./ProfessionalSidebar";

const backgroundImage =
  "url(https://c.animaapp.com/I0GZ-jEdYsqJttTJa8RIUw/img/background-test.png)";

const logoSrc =
  "https://c.animaapp.com/I0GZ-jEdYsqJttTJa8RIUw/img/myblif-logo---compact-shell.png";

export type ProfessionalShellProps = {
  /** Which sidebar section is active on this screen. */
  activeNavItem: ProfessionalNavItemKey;
  /** Main content slot (row-start-3). */
  children: ReactNode;
};

/**
 * Shared Professional Cabinet shell (Stage 7).
 *
 * Scope: MYBLIF logo (fixed 48×48) + Left Sidebar + the workspace grid
 * container + the single shared Operating Filter Bar (OperatingFilterBar),
 * now used by all 5 Professional screens (Project List, Order Details,
 * Calendar Month/Week/Day). Each screen only supplies its own main content.
 */
export const ProfessionalShell = ({
  activeNavItem,
  children,
}: ProfessionalShellProps): JSX.Element => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage }}
    >
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[7%_1%_minmax(0,1fr)] grid-rows-[5%_2%_minmax(0,1fr)] p-[1%]">
        <img
          className="absolute left-[2%] top-[1%] z-10 h-12 w-12 object-contain"
          src={logoSrc}
          alt="Myblif logo compact"
        />
        <aside
          className="col-start-1 row-start-3 min-w-0"
          aria-label="Professional navigation"
        >
          <ProfessionalSidebar activeItem={activeNavItem} />
        </aside>
        <section
          className="col-start-3 row-start-1 min-w-0"
          aria-label="Order status summary"
        >
          <OperatingFilterBar />
        </section>
        <main
          className="col-start-3 row-start-3 min-h-0 min-w-0"
          aria-label="Orders management"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
