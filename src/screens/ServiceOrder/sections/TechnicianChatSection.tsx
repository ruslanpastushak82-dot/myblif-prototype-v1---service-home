import { FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

const messages = [
  {
    id: "issue",
    text: "The latch does not engage when the automatic door closes.",
    className: "w-full max-w-[440px] self-start bg-[#dbe8f9]",
  },
  {
    id: "response",
    text: "From the video, the lock mechanism appears to be working. The main issue seems to be with the door closing. I can adjust and repair it.",
    className: "w-full max-w-[520px] self-end bg-[#eaeff4]",
  },
  {
    id: "availability",
    text: "Can you make it today?",
    className: "w-full max-w-[440px] self-start bg-[#dbe8f9]",
  },
];

const estimateLines = [
  "Date: September 16, 2026",
  "Time: around 5:30 PM",
  "Estimated duration: 1 hour",
  "Repair estimate: $180–$200 CAD",
];

const attachmentButtons = [
  {
    id: "microphone",
    label: "🎤",
    ariaLabel: "Record audio",
    className: "bg-[#e1efff]",
  },
  {
    id: "photo",
    label: "📷",
    ariaLabel: "Attach photo",
    className: "bg-[#eef2f7]",
  },
  {
    id: "video",
    label: "🎥",
    ariaLabel: "Attach video",
    className: "bg-[#eef2f7]",
  },
];

export const TechnicianChatSection = (): JSX.Element => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="w-full max-w-[822px] overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-white shadow-none">
      <CardContent className="flex min-h-[440px] flex-col p-0">
        <section
          aria-labelledby="technician-chat-title"
          className="flex min-h-[440px] flex-col px-6 pb-4 pt-[22px]"
        >
          <h2
            id="technician-chat-title"
            className="[font-family:'Inter',Helvetica] text-lg font-bold leading-normal tracking-[0] text-[#012878]"
          >
            MYBLIF Chat
          </h2>
          <div className="mt-[13px] flex flex-1 flex-col gap-[15px]">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`${message.className} shrink-0 overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] shadow-none`}
              >
                <CardContent className="px-4 py-[15px] [font-family:'Inter',Helvetica] text-sm font-normal leading-normal tracking-[0] text-[#012878]">
                  {message.text}
                </CardContent>
              </Card>
            ))}

            <Card className="w-full max-w-[520px] self-end overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#eaeff4] shadow-none">
              <CardContent className="px-4 py-[15px] [font-family:'Inter',Helvetica] text-sm font-normal leading-[17px] tracking-[0] text-[#012878]">
                {estimateLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </CardContent>
            </Card>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-[17px] grid grid-cols-[minmax(0,1fr)_52px_52px_52px_118px] gap-2"
          >
            <Input
              aria-label="Message"
              placeholder="Type your message…"
              className="h-[46px] min-w-0 rounded-[14px] border-2 border-solid border-[#012878] px-4 [font-family:'Inter',Helvetica] text-sm text-[#012878] shadow-none placeholder:text-[#012878]"
            />
            {attachmentButtons.map((button) => (
              <Button
                key={button.id}
                type="button"
                aria-label={button.ariaLabel}
                className={`h-[46px] w-[52px] rounded-[10px] border border-solid border-[#012878] p-0 [font-family:'Inter',Helvetica] text-sm font-bold text-[#012878] shadow-none hover:brightness-95 ${button.className}`}
              >
                {button.label}
              </Button>
            ))}

            <Button
              type="submit"
              className="h-[46px] w-[118px] rounded-[10px] border-2 border-solid border-[#012878] bg-[#fcce5e] p-0 [font-family:'Inter',Helvetica] text-sm font-bold text-[#012878] shadow-none hover:bg-[#fcce5e] hover:brightness-95"
            >
              Send
            </Button>
          </form>
        </section>
      </CardContent>
    </Card>
  );
};
