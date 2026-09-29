import { Button } from "../../../components/ui/button";

const assetBaseUrl = "https://c.animaapp.com/I0GZ-jEdYsqJttTJa8RIUw/img";

const navigationItems = [
  {
    label: "Calendar",
    icon: `${assetBaseUrl}/calendar.svg`,
    alt: "Calendar",
  },
  {
    label: "Orders",
    icon: `${assetBaseUrl}/folder.svg`,
    alt: "Folder",
    badge: "5",
    active: true,
  },
  {
    label: "Messages",
    icon: `${assetBaseUrl}/message-square.svg`,
    alt: "Message square",
    badge: "6",
  },
  {
    label: "Tools",
    icon: `${assetBaseUrl}/tool.svg`,
    alt: "Tool",
  },
  {
    label: "Finance",
    icon: `${assetBaseUrl}/dollar-sign.svg`,
    alt: "Dollar sign",
  },
];

const navigationButtonClass =
  "relative ml-2.5 w-[calc(100%-20px)] shrink-0 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-[#ffffffdb]";

export const ApplicationNavigationSection = (): JSX.Element => {
  return (
    <nav
      aria-label="Application navigation"
      className="flex min-h-[832px] w-24 flex-col rounded-[14px] border border-solid border-[#308cf947] bg-[#308cf91f] py-3.5"
    >
      {navigationItems.map((item, index) => (
        <Button
          key={item.label}
          type="button"
          aria-current={item.active ? "page" : undefined}
          className={`${navigationButtonClass} ${index === 0 ? "mt-0" : "mt-2.5"} h-16 flex-col gap-1 ${
            item.active
              ? "bg-[#308cf9eb] text-white shadow-[0px_0px_6px_#308cf92e] hover:bg-[#308cf9eb]"
              : ""
          }`}
        >
          <img
            className="mt-[7px] h-[25px] w-[25px]"
            src={item.icon}
            alt={item.alt}
          />
          <span className="w-[72px] text-center font-['Inter',Helvetica] text-[10px] font-normal leading-[normal]">
            {item.label}
          </span>
          {item.badge && (
            <span className="absolute left-[54px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-[9px] bg-[#308cf9] font-['Inter',Helvetica] text-[10px] font-normal leading-[normal] text-white">
              {item.badge}
            </span>
          )}
        </Button>
      ))}

      <Button
        type="button"
        className={`${navigationButtonClass} mt-2.5 h-16 flex-col gap-2 hover:bg-[#ffffffdb]`}
      >
        <span className="mt-[7px] flex h-6 w-6 items-center justify-center rounded-xl bg-[#308cf9] font-['Inter',Helvetica] text-[13px] font-bold leading-[normal] text-white">
          ?
        </span>
        <span className="w-[72px] text-center font-['Inter',Helvetica] text-[10px] font-normal leading-[normal]">
          Help
        </span>
      </Button>
      <Button
        type="button"
        className={`${navigationButtonClass} mt-2.5 h-16 flex-col gap-[5px] hover:bg-[#ffffffdb]`}
      >
        <span className="relative mt-[7px] flex h-6 w-6 items-center justify-center overflow-hidden rounded-xl bg-[#308cf9]">
          <img
            className="h-4 w-4"
            src={`${assetBaseUrl}/star.svg`}
            alt="Star"
          />
          <span className="absolute left-[9px] top-[9px] h-1.5 w-1.5 rounded-[3px] bg-[#308cf9]" />
        </span>
        <span className="w-[72px] text-center font-['Inter',Helvetica] text-[10px] font-normal leading-[normal]">
          Settings
        </span>
      </Button>
      <Button
        type="button"
        className={`${navigationButtonClass} mt-32 h-[70px] flex-col gap-[5px] bg-[#ffffffe6] hover:bg-[#ffffffe6]`}
      >
        <span className="relative mt-1 h-[22px] w-[18px]">
          <span className="absolute left-1 top-0 h-3 w-2 rounded border-[1.6px] border-solid border-[#308cf9]" />
          <img
            className="absolute left-px top-[11px] h-[7px] w-3.5"
            src={`${assetBaseUrl}/ellipse.svg`}
            alt="Assistant status"
          />
          <span className="absolute left-[7px] top-3.5 h-[5px] w-0.5 rounded-[1px] bg-[#308cf9]" />
          <span className="absolute left-1 top-[18px] h-0.5 w-2 rounded-[1px] bg-[#308cf9]" />
        </span>
        <span className="w-[72px] text-center font-['Inter',Helvetica] text-[10px] font-normal leading-[normal]">
          OTFAR
        </span>
        <span className="w-[72px] whitespace-nowrap text-center font-['Inter',Helvetica] text-xs font-normal leading-[normal] text-[#667085]">
          AI Assistant
        </span>
      </Button>
      <Button
        type="button"
        className={`${navigationButtonClass} mt-[22px] h-[72px] flex-col gap-2 overflow-hidden hover:bg-[#ffffffdb]`}
      >
        <span className="relative mt-[7px] flex h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[1.5px] border-solid border-[#012878e6]">
          <span className="absolute top-1 h-2 w-2 rounded bg-[#012878]" />
          <span className="absolute top-4 h-2 w-4 rounded bg-[#012878]" />
        </span>
        <span className="w-[72px] text-center font-['Inter',Helvetica] text-[10px] font-normal leading-[normal]">
          Profile
        </span>
      </Button>
    </nav>
  );
};
