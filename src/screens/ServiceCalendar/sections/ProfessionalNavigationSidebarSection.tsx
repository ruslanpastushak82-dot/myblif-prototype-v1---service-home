import { useState } from "react";
import { Button } from "../../../components/ui/button";

const assetBase = "https://c.animaapp.com/g0hxWhi-_XcFFGB69NxFCA/img";

const navigationItems = [
  {
    label: "Calendar",
    alt: "Calendar",
    icon: `${assetBase}/calendar.svg`,
  },
  {
    label: "Projects",
    alt: "Folder",
    icon: `${assetBase}/folder.svg`,
    badge: "5",
    highlighted: true,
  },
  {
    label: "Messages",
    alt: "Message square",
    icon: `${assetBase}/message-square.svg`,
    badge: "6",
    highlighted: true,
  },
  {
    label: "Tools",
    alt: "Tool",
    icon: `${assetBase}/tool.svg`,
  },
  {
    label: "Finances",
    alt: "Dollar sign",
    icon: `${assetBase}/dollar-sign.svg`,
  },
];

const secondaryItems = [
  {
    label: "Tips",
    type: "tips",
  },
  {
    label: "Settings",
    type: "settings",
  },
];

export const ProfessionalNavigationSidebarSection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState("Calendar");

  return (
    <div className="flex w-full items-start">
      <nav
        aria-label="Professional navigation"
        className="ml-3 mt-[84px] flex h-[832px] w-24 shrink-0 flex-col rounded-[14px] border border-solid border-[#308cf947] bg-[#308cf91f] px-2.5"
      >
        <div className="mt-3.5 flex flex-col gap-2.5">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outline"
              aria-current={activeItem === item.label ? "page" : undefined}
              onClick={() => setActiveItem(item.label)}
              className={`relative flex h-16 w-[76px] flex-col gap-1 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] hover:bg-white ${
                item.highlighted ? "shadow-[0px_0px_6px_#308cf92e]" : ""
              }`}
            >
              <span className="grid w-[72px] grid-cols-[1fr_25px_1fr] items-start">
                <span aria-hidden="true" />
                <img
                  className="h-[25px] w-[25px]"
                  alt={item.alt}
                  src={item.icon}
                />
                {item.badge ? (
                  <span className="flex h-[18px] w-[18px] items-center justify-center justify-self-end rounded-[9px] bg-[#308cf9] font-['Inter',Helvetica] text-[10px] font-normal leading-none text-white">
                    {item.badge}
                  </span>
                ) : (
                  <span aria-hidden="true" />
                )}
              </span>
              <span className="w-[72px] font-['Inter',Helvetica] text-center text-[10px] font-normal leading-normal">
                {item.label}
              </span>
            </Button>
          ))}

          {secondaryItems.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outline"
              aria-current={activeItem === item.label ? "page" : undefined}
              onClick={() => setActiveItem(item.label)}
              className="flex h-16 w-[76px] flex-col gap-1 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] hover:bg-white"
            >
              {item.type === "tips" ? (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#308cf9] font-['Inter',Helvetica] text-[13px] font-bold leading-normal text-white">
                    ?
                  </span>
                  <span className="w-[72px] font-['Inter',Helvetica] text-center text-[10px] font-normal leading-normal">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#308cf9]">
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <img
                        className="h-4 w-4"
                        alt="Star"
                        src={`${assetBase}/star.svg`}
                      />
                      <span className="absolute h-1.5 w-1.5 rounded-[3px] bg-[#308cf9]" />
                    </span>
                  </span>
                  <span className="w-[72px] font-['Inter',Helvetica] text-center text-[10px] font-normal leading-normal">
                    {item.label}
                  </span>
                </>
              )}
            </Button>
          ))}
        </div>
        <div className="h-32 shrink-0" />
        <Button
          type="button"
          variant="outline"
          aria-current={activeItem === "OTFAR" ? "page" : undefined}
          onClick={() => setActiveItem("OTFAR")}
          className="flex h-[70px] w-[76px] flex-col gap-[5px] rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffe6] p-0 text-[#012878] hover:bg-white"
        >
          <span className="relative mt-1 flex h-[22px] w-[18px] items-center justify-center">
            <span className="absolute left-1 top-0 h-3 w-2 rounded border-[1.6px] border-solid border-[#308cf9]" />
            <img
              className="absolute left-px top-[11px] h-[7px] w-3.5"
              alt="Ellipse"
              src={`${assetBase}/ellipse.svg`}
            />
            <span className="absolute left-[7px] top-3.5 h-[5px] w-0.5 rounded-[1px] bg-[#308cf9]" />
            <span className="absolute left-1 top-[18px] h-0.5 w-2 rounded-[1px] bg-[#308cf9]" />
          </span>
          <span className="w-[72px] font-['Inter',Helvetica] text-center text-[10px] font-normal leading-normal">
            OTFAR
          </span>
          <span className="w-[72px] whitespace-nowrap font-['Inter',Helvetica] text-center text-xs font-normal leading-normal text-[#667085]">
            AI Assistant
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-current={activeItem === "Profile" ? "page" : undefined}
          onClick={() => setActiveItem("Profile")}
          className="mt-[22px] flex h-[72px] w-[76px] flex-col gap-2 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] hover:bg-white"
        >
          <span className="relative mt-[7px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-solid border-[#012878e6]">
            <span className="absolute top-1 h-2 w-2 rounded bg-[#012878]" />
            <span className="absolute top-4 h-2 w-4 rounded bg-[#012878]" />
          </span>
          <span className="w-[72px] font-['Inter',Helvetica] text-center text-[10px] font-normal leading-normal">
            Profile
          </span>
        </Button>
      </nav>
    </div>
  );
};
