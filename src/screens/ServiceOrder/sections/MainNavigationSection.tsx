import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

const assetBaseUrl = "https://c.animaapp.com/a6pmK9CE_VYa_kCXqMQRGw/img";

const navigationItems = [
  {
    label: "Calendar",
    image: `${assetBaseUrl}/calendar.svg`,
    alt: "Calendar",
    notification: undefined,
  },
  {
    label: "Orders",
    image: `${assetBaseUrl}/folder.svg`,
    alt: "Folder",
    notification: "5",
  },
  {
    label: "Messages",
    image: `${assetBaseUrl}/message-square.svg`,
    alt: "Message square",
    notification: "6",
  },
  {
    label: "Tools",
    image: `${assetBaseUrl}/tool.svg`,
    alt: "Tool",
    notification: undefined,
  },
  {
    label: "Finances",
    image: `${assetBaseUrl}/dollar-sign.svg`,
    alt: "Dollar sign",
    notification: undefined,
  },
];

const actionItems = [
  {
    label: "Tips",
    type: "tips",
  },
  {
    label: "Settings",
    type: "settings",
  },
];

export const MainNavigationSection = (): JSX.Element => {
  const [activeItem, setActiveItem] = useState("Calendar");

  return (
    <nav
      aria-label="Main navigation"
      className="flex min-h-[832px] w-24 flex-col rounded-[14px] border border-solid border-[#308cf947] bg-[#308cf91f] px-2.5 py-3.5"
    >
      <div className="flex flex-col gap-2.5">
        {navigationItems.map((item, index) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            aria-current={activeItem === item.label ? "page" : undefined}
            onClick={() => setActiveItem(item.label)}
            className={`relative flex h-16 w-full flex-col gap-1 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-white ${
              index === 0 ? "shadow-none" : ""
            }`}
          >
            <img
              className="h-[25px] w-[25px]"
              alt={item.alt}
              src={item.image}
            />
            <span className="[font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
              {item.label}
            </span>
            {item.notification && (
              <Badge className="absolute right-0.5 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-[9px] bg-[#308cf9] p-0 text-center [font-family:'Inter',Helvetica] text-[10px] font-normal leading-[normal] text-white hover:bg-[#308cf9]">
                {item.notification}
              </Badge>
            )}
          </Button>
        ))}

        {actionItems.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            aria-current={activeItem === item.label ? "page" : undefined}
            onClick={() => setActiveItem(item.label)}
            className="relative flex h-16 w-full flex-col rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-white"
          >
            {item.type === "tips" && (
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#308cf9] [font-family:'Inter',Helvetica] text-[13px] font-bold leading-[normal] text-white">
                ?
              </span>
            )}

            {item.type === "settings" && (
              <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-xl bg-[#308cf9]">
                <img
                  className="h-4 w-4"
                  alt="Star"
                  src={`${assetBaseUrl}/star.svg`}
                />
                <span className="absolute left-[9px] top-[9px] h-1.5 w-1.5 rounded-[3px] bg-[#308cf9]" />
              </span>
            )}

            <span className="[font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
      <div className="mt-32 flex flex-col gap-[22px]">
        <Button
          type="button"
          variant="ghost"
          aria-current={activeItem === "OTFAR" ? "page" : undefined}
          onClick={() => setActiveItem("OTFAR")}
          className="flex h-[70px] w-full flex-col rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffe6] p-0 text-[#012878] hover:bg-white"
        >
          <span className="relative flex h-[22px] w-[18px] items-start justify-center">
            <span className="absolute left-1 top-0 h-3 w-2 rounded border-[1.6px] border-solid border-[#308cf9]" />
            <img
              className="absolute left-px top-[11px] h-[7px] w-3.5"
              alt="Ellipse"
              src={`${assetBaseUrl}/ellipse.svg`}
            />
            <span className="absolute left-[7px] top-3.5 h-[5px] w-0.5 rounded-[1px] bg-[#308cf9]" />
            <span className="absolute left-1 top-[18px] h-0.5 w-2 rounded-[1px] bg-[#308cf9]" />
          </span>
          <span className="[font-family:'Inter',Helvetica] text-[10px] font-normal leading-[normal]">
            OTFAR
          </span>
          <span className="[font-family:'Inter',Helvetica] text-xs font-normal leading-[normal] text-[#667085]">
            AI
            <br />
            Assistant
          </span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          aria-current={activeItem === "Profile" ? "page" : undefined}
          onClick={() => setActiveItem("Profile")}
          className="flex h-[72px] w-full flex-col gap-2 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] hover:bg-white"
        >
          <span className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-solid border-[#012878e6]">
            <span className="absolute top-1 h-2 w-2 rounded bg-[#012878]" />
            <span className="absolute bottom-[5px] h-2 w-4 rounded bg-[#012878]" />
          </span>
          <span className="[font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
            Profile
          </span>
        </Button>
      </div>
    </nav>
  );
};
