import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QuickRequestExport } from "./screens/QuickRequestExport";
import { RequestChat } from "./screens/RequestChat/RequestChat";
import { ServiceHome } from "./screens/ServiceHome";
import { ServiceCalendar } from "./screens/ServiceCalendar";
import { ServiceCalendarV2 } from "./screens/ServiceCalendarV2";
import { ServiceCalendarDay } from "./screens/ServiceCalendarDay";
import { ServiceOrder } from "./screens/ServiceOrder";
import { ServiceProfessional } from "./screens/ServiceProfessional";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <ServiceHome />,
  },
  {
    path: "/service-home",
    element: <ServiceHome />,
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
  {
    path: "/service-order",
    element: <ServiceOrder />,
  },
  {
    path: "/service-professional",
    element: <ServiceProfessional />,
  },
  {
    path: "/request-u43-chat",
    element: <RequestChat />,
  },
  {
    path: "/quick-request-u8212-export-diagnostic",
    element: <QuickRequestExport />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
