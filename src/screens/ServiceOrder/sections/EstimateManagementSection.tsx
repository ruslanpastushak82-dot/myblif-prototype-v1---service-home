import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

const estimateFields = [
  { label: "Date", value: "Sep 16, 2026" },
  { label: "Arrival Time", value: "Around 5:30 PM" },
  { label: "Estimated Duration", value: "E.g. 2 hours" },
  { label: "Estimated Cost", value: "$180–$200 CAD" },
];

const statuses = [
  { label: "Sent", className: "bg-[#f7f7f7] opacity-45" },
  { label: "Under Review", className: "bg-[#f7f7f7] opacity-45" },
  { label: "Confirmed", className: "bg-[#e5f4ff]" },
];

const workflowActions = ["Reschedule", "Rework", "Completed"];

const financialFields = [
  {
    label: "Actual Cost",
    placeholder: "Enter actual cost",
    className: "",
  },
  {
    label: "HST / Tax",
    placeholder: "HST / Tax — inactive",
    className: "opacity-45",
    disabled: true,
  },
  {
    label: "Total",
    value: "$ — automatic",
    className: "",
  },
];

export const EstimateManagementSection = ({
  isPreAccept = false,
}: {
  isPreAccept?: boolean;
}): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState("Confirmed");
  const { reference } = useParams<{ reference?: string }>();
  const [date, setDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [duration, setDuration] = useState("");

  const sendAppointment = async () => {
    if (isPreAccept || !reference || !date || !arrivalTime || !duration) return;
    const minutes = Number(duration);
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    const { data: order } = await supabase.from("requests").select("id").eq("reference", reference).maybeSingle();
    if (!order) return;
    const { error } = await supabase.rpc("set_service_request_appointment", { p_request_id: order.id, p_date: date, p_arrival_time: arrivalTime, p_duration_minutes: minutes });
    if (!error) setSelectedStatus("Sent");
  };

  return (
      <Card className="w-full max-w-[456px] overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
        <CardHeader className="px-5 pb-0 pt-3.5">
          <CardTitle className="[font-family:'Inter',Helvetica] text-xl font-normal leading-7 tracking-[0] text-[#012878]">
            Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-3 pt-2">
          <div className="grid grid-cols-[minmax(0,170px)_minmax(0,228px)] gap-x-1">
            {estimateFields.map((field) => (
              <div key={field.label} className="contents">
                <label className="flex h-9 items-center [font-family:'Inter',Helvetica] text-xs font-normal leading-normal tracking-[0] text-[#1e283a]">
                  {field.label}
                </label>
                <Input
                  type={field.label === "Date" ? "date" : field.label === "Arrival Time" ? "time" : field.label === "Estimated Duration" ? "number" : "text"}
                  value={field.label === "Date" ? date : field.label === "Arrival Time" ? arrivalTime : field.label === "Estimated Duration" ? duration : field.value}
                  onChange={(e) => { if (field.label === "Date") setDate(e.target.value); else if (field.label === "Arrival Time") setArrivalTime(e.target.value); else if (field.label === "Estimated Duration") setDuration(e.target.value); }}
                  readOnly={field.label === "Estimated Cost"}
                  placeholder={field.label === "Estimated Duration" ? "Minutes" : undefined}
                  className="h-8 rounded-lg border-2 border-[#012878] bg-[#f9fbfd] px-2.5 [font-family:'Inter',Helvetica] text-[13px] font-normal leading-normal tracking-[0] text-[#1e283a] shadow-none focus-visible:ring-0"
                />
              </div>
            ))}

            <div className="col-start-2 mt-1">
              <Button
                type="button"
                onClick={() => void sendAppointment()}
                disabled={isPreAccept || !reference || !date || !arrivalTime || !duration}
                className="h-[38px] w-full rounded-[9px] border-2 border-[#012878] bg-[#012878] px-0 [font-family:'Inter',Helvetica] text-[13px] font-normal text-white opacity-40 shadow-none hover:bg-[#012878]"
              >
                Send to Customer
              </Button>
            </div>
            <div className="col-span-2 mt-1 grid grid-cols-3 gap-1">
              {statuses.map((status) => (
                <Button
                  key={status.label}
                  type="button"
                  aria-pressed={selectedStatus === status.label}
                  onClick={() => setSelectedStatus(status.label)}
                  className={`h-[34px] justify-start rounded-lg border border-[#05388c] px-3 [font-family:'Inter',Helvetica] text-[11px] font-normal tracking-[0] text-[#052d7a] shadow-none hover:bg-inherit ${status.className} ${
                    selectedStatus === status.label
                      ? "ring-1 ring-[#012878] ring-offset-1"
                      : ""
                  }`}
                >
                  {status.label}
                </Button>
              ))}
            </div>
            <div className="col-span-2 mt-1 grid grid-cols-3 gap-1">
              {workflowActions.map((action) => (
                <Button
                  key={action}
                  type="button"
                  className="h-9 justify-start rounded-lg border border-[#1e519e] bg-[#eff7ff] px-2.5 [font-family:'Inter',Helvetica] text-xs font-medium tracking-[0] text-black shadow-none hover:bg-[#eff7ff]"
                >
                  {action}
                </Button>
              ))}
            </div>
            <div className="col-span-2 mt-3 grid grid-cols-[minmax(0,170px)_minmax(0,228px)] gap-x-1">
              {financialFields.map((field) => (
                <div key={field.label} className="contents">
                  <label className="flex h-9 items-center [font-family:'Inter',Helvetica] text-xs font-medium leading-normal tracking-[0] text-black">
                    {field.label}
                  </label>
                  <Input
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className={`h-7 rounded-md border border-[#adb7c6] bg-[#f9f9f9] px-2.5 [font-family:'Inter',Helvetica] text-xs font-normal leading-normal tracking-[0] text-black shadow-none placeholder:text-black focus-visible:ring-0 ${field.className}`}
                  />
                </div>
              ))}

              <div className="col-start-2 mt-1">
                <Button
                  type="button"
                  className="h-9 w-full justify-start rounded-lg border border-[#1e519e] bg-[#f4f4f4] px-2.5 [font-family:'Inter',Helvetica] text-xs font-medium tracking-[0] text-black opacity-40 shadow-none hover:bg-[#f4f4f4]"
                >
                  Add Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};
