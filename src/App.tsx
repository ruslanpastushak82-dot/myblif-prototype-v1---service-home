import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProfessionalAuthGate } from "./components/ProfessionalAuthGate/ProfessionalAuthGate";
import { QuickRequestExport } from "./screens/QuickRequestExport";
import { RequestChat } from "./screens/RequestChat/RequestChat";
import { ServiceHome } from "./screens/ServiceHome";
import { ServiceCalendar } from "./screens/ServiceCalendar";
import { ServiceCalendarV2 } from "./screens/ServiceCalendarV2";
import { ServiceCalendarDay } from "./screens/ServiceCalendarDay";
import { ServiceOrder } from "./screens/ServiceOrder";
import { ServiceProfessional } from "./screens/ServiceProfessional";
import { CustomerRequestProvider } from "./state/CustomerRequestContext";

const router = createBrowserRouter([
  {
    // Shared Customer + Professional group (Stage 2A): Service Home ->
    // Quick Request -> Request + MYBLIF Chat, plus the Professional
    // screens (Project List, Order Details). CustomerRequestProvider is
    // mounted once here, as a layout route, so a request the Customer
    // submits is immediately visible to the Professional screens in the
    // same session (a separate Provider per route would isolate them
    // from each other instead). Calendar/OTFAR screens stay outside this
    // group -- untouched, not part of Stage 2A.
    element: (
      <CustomerRequestProvider>
        <Outlet />
      </CustomerRequestProvider>
    ),
    children: [
      {
        path: "/*",
        element: <ServiceHome />,
      },
      {
        path: "/service-home",
        element: <ServiceHome />,
      },
      {
        path: "/quick-request-u8212-export-diagnostic",
        element: <QuickRequestExport />,
      },
      {
        path: "/request-u43-chat/:reference",
        element: <RequestChat />,
      },
      {
        path: "/service-professional",
        element: (
          <ProfessionalAuthGate>
            <ServiceProfessional />
          </ProfessionalAuthGate>
        ),
      },
      {
        // Existing, unparameterized /service-order is kept exactly as it
        // was (renders the Stage 1 hardcoded mock order, unchanged) --
        // this new sibling route is the smallest addition that gives a
        // specific Customer-created order a stable, linkable identity.
        path: "/service-order",
        element: <ServiceOrder />,
      },
      {
        path: "/service-order/:reference",
        element: <ServiceOrder />,
      },
    ],
  },
  {
    path: "/service-calendar",
    element: <ServiceCalendar />,
  },
  {
    path: "/service-calendar-v2",
    element: <ServiceCalendarV2 />,
  },
  {
    path: "/service-calendar-day",
    element: <ServiceCalendarDay />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
