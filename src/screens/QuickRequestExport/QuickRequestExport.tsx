import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

const navy = "text-[#012878]";
const controlClass =
  "h-11 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm text-[#012878] shadow-none";
const optionClass =
  "h-11 rounded-[10px] border-2 border-[#012878] bg-[#eef2f7] px-3 text-sm text-[#012878] shadow-none";

const serviceOptions = [
  "Doors",
  "Furniture",
  "Assembly & Installation",
  "Welding",
  "Plumbing",
  "In development",
];

const clientTypes = ["Private", "Business"];
const urgencyOptions = ["Urgent", "Not Urgent"];
const preferredPeriods = ["Morning", "Afternoon", "Any time"];
const notificationOptions = ["SMS", "WhatsApp", "Both"];

const ServiceSelect = ({ value }: { value: string }) => (
  <Select defaultValue={value}>
    <SelectTrigger className={controlClass}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {serviceOptions.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const OptionGroup = ({
  options,
  defaultValue,
  widths = "w-[150px]",
}: {
  options: string[];
  defaultValue: string;
  widths?: string;
}) => (
  <ToggleGroup
    type="single"
    defaultValue={defaultValue}
    className="flex flex-wrap justify-start gap-3"
  >
    {options.map((option) => (
      <ToggleGroupItem
        key={option}
        value={option}
        className={`${widths} ${optionClass} data-[state=on]:bg-[#eef2f7] data-[state=on]:text-[#012878]`}
      >
        {option}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

export const QuickRequestExport = (): JSX.Element => {
  const [privateNumber, setPrivateNumber] = useState(false);

  return (
    <main
      className="min-h-screen w-full min-w-[800px] bg-[#e1efff] [background:url(https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img/myblif-standard-background.png)_center/cover]"
      data-model-id="1425:1929"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-[6.67%] pb-8">
        <header className="relative flex min-h-[191px] items-start justify-between">
          <div className="mt-[34px] flex items-start gap-4">
            <img
              className="mt-2.5 h-16 w-16 object-contain"
              alt="Myblif official logo"
              src="https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img/myblif-official-logo-2.png"
            />
            <div className="mt-[19px] flex flex-col [font-family:'Inter',Helvetica] font-bold leading-none text-[#012878]">
              <h1 className="text-[38px]">MYBLIF Service</h1>
              <p className="mt-1 text-4xl">Quick Request</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-[58px] h-10 w-20 rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2 text-base font-bold text-[#012878] hover:bg-white"
          >
            🌐&nbsp;&nbsp;EN⌄
          </Button>
        </header>
        <form className="grid w-full grid-cols-[minmax(0,584px)_minmax(0,472px)] gap-[70px]">
          <section
            className="flex flex-col gap-0"
            aria-label="Request information"
          >
            <div className="space-y-[10px]">
              {serviceOptions.map((service) => (
                <ServiceSelect key={service} value={service} />
              ))}
            </div>
            <fieldset className="mt-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Request Details *
              </legend>
              <div className="relative">
                <Textarea
                  aria-label="Request details"
                  defaultValue=""
                  placeholder="Describe what you need, what the problem is, or what you would like us to do…"
                  className="h-[212px] resize-none rounded-[10px] border-2 border-[#012878] bg-white px-3.5 py-4 text-sm text-[#012878] placeholder:text-[#7a7a7a]"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="absolute bottom-2.5 right-2.5 h-[52px] w-[52px] rounded-[10px] border-[#012878] bg-[#e1efff] p-0 text-sm text-[#012878] hover:bg-[#d5e8ff]"
                >
                  🎤
                </Button>
              </div>
            </fieldset>
            <fieldset className="mt-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Attachments
              </legend>
              <div className="grid grid-cols-4 gap-[15px]">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-2.5 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  📷&nbsp;&nbsp;Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  Choose Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-2.5 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  🎥&nbsp;&nbsp;Record Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  Choose Video
                </Button>
              </div>
            </fieldset>
          </section>
          <section className="flex flex-col" aria-label="Request preferences">
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Client Type *
              </legend>
              <OptionGroup options={clientTypes} defaultValue="Private" />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Urgency *
              </legend>
              <OptionGroup options={urgencyOptions} defaultValue="Urgent" />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Preferred Period *
              </legend>
              <OptionGroup
                options={preferredPeriods}
                defaultValue="Morning"
                widths="w-24"
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Notifications
              </legend>
              <OptionGroup
                options={notificationOptions}
                defaultValue="SMS"
                widths="w-24"
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Contact
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  aria-label="Name"
                  defaultValue=""
                  placeholder="Name"
                  className={controlClass}
                />
                <Input
                  aria-label="Mobile Number"
                  defaultValue=""
                  placeholder="Mobile Number"
                  className={controlClass}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[13px] text-[#012878]">
                  <Checkbox
                    checked={privateNumber}
                    onCheckedChange={(checked) =>
                      setPrivateNumber(checked === true)
                    }
                    className="h-[18px] w-[18px] rounded-[3px] border-[#012878] bg-white data-[state=checked]:bg-[#012878]"
                  />
                  Keep my phone number private
                </label>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 w-[172px] rounded-[10px] border-2 border-[#012878] bg-[#eef2f7] px-3 text-sm font-normal text-[#012878] hover:bg-white"
                >
                  ?&nbsp;&nbsp;How it works
                </Button>
              </div>
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Approximate Location *
              </legend>
              <Select defaultValue="City or area">
                <SelectTrigger className={controlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="City or area">City or area</SelectItem>
                </SelectContent>
              </Select>
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Property Type *
              </legend>
              <Select defaultValue="Select property type">
                <SelectTrigger className={controlClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select property type">
                    Select property type
                  </SelectItem>
                </SelectContent>
              </Select>
            </fieldset>
            <div className="mt-auto flex flex-col gap-3">
              <Button
                type="submit"
                className="h-[50px] rounded-[10px] border-2 border-[#012878] bg-[#fcce5e] text-base font-bold text-[#012878] hover:bg-[#ffd978]"
              >
                Send Request
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-[50px] rounded-[10px] border-2 border-[#012878] bg-[#b7bcc6] text-base font-bold text-[#4c515b] hover:bg-[#c7cbd2]"
              >
                New Order
              </Button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};
