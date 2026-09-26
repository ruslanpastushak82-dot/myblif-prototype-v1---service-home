import { Button } from "../../../components/ui/button";

type NavigationItem = {
  label: string;
  alt?: string;
  icon?: string;
  badge?: string;
  className?: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Calendar",
    alt: "Calendar",
    icon: "https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/calendar.svg",
    className: "mt-3.5 gap-1",
  },
  {
    label: "Projects",
    alt: "Folder",
    icon: "https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/folder.svg",
    badge: "5",
    className: "mt-2.5",
  },
  {
    label: "Messages",
    alt: "Message square",
    icon: "https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/message-square.svg",
    badge: "6",
    className: "mt-2.5",
  },
  {
    label: "Tools",
    alt: "Tool",
    icon: "https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/tool.svg",
    className: "mt-2.5 gap-1",
  },
  {
    label: "Finances",
    alt: "Dollar sign",
    icon: "https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/dollar-sign.svg",
    className: "mt-2.5 gap-1",
  },
];

export const ProfessionalNavigationSection = (): JSX.Element => {
  return (
    <aside className="ml-3 mt-[84px] flex h-[832px] w-24 flex-col rounded-[14px] border border-solid border-[#308cf947] bg-[#308cf91f]">
      <nav aria-label="Professional navigation" className="flex flex-col">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="outline"
            className={`relative ml-2.5 flex h-16 w-[76px] flex-col rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-[#ffffffdb] ${item.className ?? ""}`}
          >
            <img
              className="mt-[7px] h-[25px] w-[25px]"
              alt={item.alt}
              src={item.icon}
            />
            <span className="mt-1 block h-3 w-[72px] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute left-[54px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-[9px] bg-[#308cf9] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0] text-white">
                {item.badge}
              </span>
            )}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2.5 ml-2.5 flex h-16 w-[76px] flex-col gap-2 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-[#ffffffdb]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#308cf9] [font-family:'Inter',Helvetica] text-[13px] font-bold leading-[normal] tracking-[0] text-white">
            ?
          </span>
          <span className="block h-[18px] w-[72px] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
            Tips
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mt-2.5 ml-2.5 flex h-16 w-[76px] flex-col gap-[5px] rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] shadow-[0px_0px_6px_#308cf92e] hover:bg-[#ffffffdb]"
        >
          <span className="relative mt-[7px] flex h-6 w-6 items-center justify-center overflow-hidden rounded-xl bg-[#308cf9]">
            <img
              className="h-4 w-4"
              alt="Star"
              src="https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/star.svg"
            />
            <span className="absolute left-[9px] top-[9px] h-1.5 w-1.5 rounded-[3px] bg-[#308cf9]" />
          </span>
          <span className="block h-3 w-[72px] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
            Settings
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mt-32 ml-2.5 flex h-[70px] w-[76px] flex-col gap-[5px] rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffe6] p-0 text-[#012878] hover:bg-[#ffffffe6]"
        >
          <span className="relative mt-1 h-[22px] w-[18px]">
            <span className="absolute left-1 top-0 h-3 w-2 rounded border-[1.6px] border-solid border-[#308cf9]" />
            <img
              className="absolute left-px top-[11px] h-[7px] w-3.5"
              alt="Ellipse"
              src="https://c.animaapp.com/lm5VacRZGzaOmcnQS1koRw/img/ellipse.svg"
            />
            <span className="absolute left-[7px] top-3.5 h-[5px] w-0.5 rounded-[1px] bg-[#308cf9]" />
            <span className="absolute left-1 top-[18px] h-0.5 w-2 rounded-[1px] bg-[#308cf9]" />
          </span>
          <span className="block h-3.5 w-[72px] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
            OTFAR
          </span>
          <span className="block h-3 w-[72px] whitespace-nowrap [font-family:'Inter',Helvetica] text-center text-xs font-normal leading-[normal] tracking-[0] text-[#667085]">
            AI Assistant
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="relative mt-[22px] ml-2.5 flex h-[72px] w-[76px] flex-col overflow-hidden rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffdb] p-0 text-[#012878] hover:bg-[#ffffffdb]"
        >
          <span className="absolute left-[23px] top-[7px] h-[30px] w-[30px] rounded-[15px] border-[1.5px] border-solid border-[#012878e6]" />
          <span className="absolute left-[34px] top-3 h-2 w-2 rounded bg-[#012878]" />
          <span className="absolute left-[30px] top-[23px] h-2 w-4 rounded bg-[#012878]" />
          <span className="absolute left-0.5 top-[45px] w-[72px] [font-family:'Inter',Helvetica] text-center text-[10px] font-normal leading-[normal] tracking-[0]">
            Profile
          </span>
        </Button>
      </nav>
    </aside>
  );
};
