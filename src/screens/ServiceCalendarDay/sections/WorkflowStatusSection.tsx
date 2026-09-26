import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";

const workflowStatuses = [
  {
    label: "Critical",
    count: "0",
    width: "flex-[146_1_0%]",
    className: "bg-[#e533331a]",
    countClassName: "bg-[#d1282838] text-[#d12828]",
    labelClassName: "font-normal",
  },
  {
    label: "Installation",
    count: "1",
    width: "flex-[126_1_0%]",
    className: "bg-[#fffffff5] opacity-[0.38]",
    countClassName: "bg-[#308cf91f] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "Delivery",
    count: "0",
    width: "flex-[126_1_0%]",
    className: "bg-[#fffffff5] opacity-[0.38]",
    countClassName: "bg-[#308cf91f] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "Production",
    count: "0",
    width: "flex-[153_1_0%]",
    className: "bg-[#fffffff5] opacity-[0.38]",
    countClassName: "bg-[#308cf91f] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "Client Action Needed",
    count: "0",
    width: "flex-[206_1_0%]",
    className: "bg-[#fffffff5]",
    countClassName: "bg-[#308cf91f] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "Awaiting Payment",
    count: "0",
    width: "flex-[164_1_0%]",
    className: "bg-[#fffffff5]",
    countClassName: "bg-[#308cf91f] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "New Requests",
    count: "8",
    width: "flex-[170_1_0%]",
    className: "bg-[#308cf91a]",
    countClassName: "bg-[#308cf938] text-[#012878]",
    labelClassName: "font-medium",
  },
  {
    label: "Approved",
    count: "0",
    width: "flex-[141_1_0%]",
    className: "bg-[#33b2661a]",
    countClassName: "bg-[#1b8c4938] text-[#012878]",
    labelClassName: "font-medium",
  },
];

export const WorkflowStatusSection = (): JSX.Element => {
  return (
    <nav
      aria-label="Workflow status"
      className="w-full min-w-0 rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffb8] p-[6px]"
    >
      <ToggleGroup
        type="multiple"
        aria-label="Workflow status filters"
        className="flex w-full min-w-0 gap-[7.4px]"
      >
        {workflowStatuses.map((status) => (
          <ToggleGroupItem
            key={status.label}
            value={status.label}
            aria-label={`${status.label}: ${status.count}`}
            className={`h-[42px] min-w-0 shrink rounded-[10px] border-2 border-solid border-[#012878] px-2.5 py-0 text-[#012878] hover:bg-transparent focus-visible:ring-1 focus-visible:ring-[#012878] data-[state=on]:bg-transparent ${status.width} ${status.className}`}
          >
            <span
              className={`min-w-0 flex-1 overflow-hidden text-left text-[12.5px] leading-4 tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica] ${status.labelClassName}`}
            >
              {status.label}
            </span>
            <span
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-center text-xs font-normal leading-none tracking-[0] [font-family:'Inter',Helvetica] ${status.countClassName}`}
            >
              {status.count}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </nav>
  );
};
