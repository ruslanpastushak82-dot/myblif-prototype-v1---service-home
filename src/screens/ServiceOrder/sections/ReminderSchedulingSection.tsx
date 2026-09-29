import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const reminderOptions = ["1 hour before", "1 day before", "+ Add"];

export const ReminderSchedulingSection = (): JSX.Element => {
  const [selectedReminder, setSelectedReminder] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-[456px] h-[106px] overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#ffffffed] shadow-[0px_2px_8px_#308cf91a]">
      <CardContent className="flex h-full flex-col items-start gap-2.5 px-[18px] py-4">
        <h2 className="[font-family:'Inter',Helvetica] text-base font-normal leading-[normal] tracking-[0] text-[#012878]">
          Reminders
        </h2>
        <div className="flex w-full items-center gap-2.5">
          {reminderOptions.map((reminder) => {
            const isSelected = selectedReminder === reminder;

            return (
              <Button
                key={reminder}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedReminder(reminder)}
                className={`h-10 flex-1 rounded-[10px] border-2 border-solid border-[#012878] bg-[#ffffffeb] px-3.5 py-2 [font-family:'Inter',Helvetica] text-[11px] font-medium leading-[normal] tracking-[0] text-[#012878] shadow-none hover:bg-[#ffffffeb] ${
                  isSelected ? "bg-[#eaf3ff] hover:bg-[#eaf3ff]" : ""
                }`}
              >
                {reminder}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
