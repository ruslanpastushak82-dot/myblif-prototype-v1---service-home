import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useCustomerRequest } from "../../../../state/CustomerRequestContext";

export const HeaderStructureSubsection = (): JSX.Element => {
  const { activeRequest } = useCustomerRequest();

  return (
    <header className="flex min-h-[138px] w-full flex-wrap items-start px-6 md:px-12 lg:px-24">
      <img
        className="relative left-[-12.1875px] mt-7 h-16 w-16 shrink-0 object-contain"
        alt="Myblif official logo"
        src="https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img/myblif-official-logo-2.png"
      />
      <h1 className="mt-20 ml-6 whitespace-nowrap [font-family:'Inter',Helvetica] text-3xl font-bold leading-[normal] tracking-[0] text-[#012878]">
        Service Request
      </h1>
      <p className="mt-[51px] ml-8 whitespace-nowrap [font-family:'Inter',Helvetica] text-base font-bold leading-[normal] tracking-[0] text-[#012878] lg:ml-[157px]">
        {activeRequest?.reference ?? "—"}
      </p>
      <div className="ml-auto mt-10">
        <Select defaultValue="EN">
          <SelectTrigger
            aria-label="Select language"
            className="h-auto w-[92px] rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2 py-2 [font-family:'Inter',Helvetica] text-base font-bold tracking-[0] text-[#012878] shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EN">🌐 EN</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};
