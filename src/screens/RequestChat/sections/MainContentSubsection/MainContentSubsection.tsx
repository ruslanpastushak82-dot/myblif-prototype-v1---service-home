import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

const statuses = [
  "Submitted",
  "Reviewed",
  "Confirmed",
  "Rescheduled",
  "Rework",
  "Declined",
  "Completed",
];

const attachments = [
  { icon: "📷", label: "Photo 1" },
  { icon: "📷", label: "Photo 2" },
  { icon: "▶", label: "Video 1" },
];

const chatMessages = [
  {
    message: "The latch does not engage when the automatic door closes.",
    type: "customer",
  },
  {
    message:
      "From the video, the lock mechanism appears to be working. The main issue seems to be with the door closing. I can adjust and repair it.",
    type: "professional",
  },
  {
    message: "Can you make it today?",
    type: "customer",
  },
  {
    message: (
      <>
        Date: September 16, 2026
        <br />
        Time: around 5:30 PM
        <br />
        Estimated duration: 1 hour
        <br />
        Repair estimate: $180–$200 CAD
      </>
    ),
    type: "professional",
  },
];

const navy = "text-[#012878]";
const border = "border-[#012878]";

export const MainContentSubsection = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState("Confirmed");

  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-col gap-3 px-3 py-4 text-[13px] [font-family:'Inter',Helvetica] md:px-0">
      <nav
        aria-label="Request status"
        className={`flex w-full gap-2.5 overflow-x-auto rounded-[14px] border-2 bg-white p-4 ${border}`}
      >
        {statuses.map((status) => (
          <Button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`h-[42px] min-w-[130px] flex-1 rounded-[10px] border text-[13px] font-bold shadow-none ${
              selectedStatus === status
                ? "border-[#012878] bg-[#012878] text-white hover:bg-[#012878]"
                : "border-[#012878] bg-[#eef2f7] text-[#012878] hover:bg-[#dbe8f9]"
            }`}
          >
            {status}
          </Button>
        ))}
      </nav>
      <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,560px)_minmax(0,654px)]">
        <section className="flex flex-col gap-3">
          <Card
            className={`h-[444px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`p-6 ${navy}`}>
              <h2 className="text-lg font-bold">Request Details</h2>
              <div className="mt-3 space-y-4">
                <p>Service: Doors</p>
                <p className="max-w-[500px] leading-[1.35]">
                  Request: We have an automatic door at our clinic. The lock is
                  getting jammed, and the latch does not engage properly when
                  the door closes automatically.
                </p>
              </div>
              <div className="mt-10 space-y-3">
                <p>Urgency: Urgent</p>
                <p>Preferred Period: Any time</p>
                <p>Location: 968 Albion Road, Etobicoke</p>
              </div>
              <h3 className="mt-4 font-bold text-[13px]">Attachments</h3>
              <div className="mt-3 flex gap-2">
                {attachments.map((attachment) => (
                  <Button
                    key={attachment.label}
                    type="button"
                    variant="outline"
                    className={`flex h-[62px] w-[82px] flex-col gap-1 rounded-[7px] border-2 bg-white p-2 ${border} ${navy} hover:bg-[#eef2f7]`}
                  >
                    <span className="text-lg leading-5">{attachment.icon}</span>
                    <span className="text-[8px] font-normal">
                      {attachment.label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card
            className={`h-[226px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`p-6 ${navy}`}>
              <h2 className="text-lg font-bold">Appointment</h2>
              <p className="mt-2 text-base font-bold">
                Date: September 16, 2026
              </p>
              <p className="text-base">Time: around 5:30 PM</p>
              <div className="mt-3 space-y-1 text-black">
                <p>Estimated duration: 1 hour</p>
                <p>Estimated price: $180–$200 CAD</p>
                <p className="text-xs">
                  Final price may change after on-site inspection if additional
                  work or parts are required.
                </p>
              </div>
              <div className="mt-2 flex justify-between gap-3 px-3">
                <Button
                  type="button"
                  className={`h-[42px] flex-1 rounded-[10px] border-2 bg-[#eef2f7] font-bold ${border} ${navy} hover:bg-[#dbe8f9]`}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  className={`h-[42px] flex-1 rounded-[10px] border-2 bg-[#eef2f7] font-bold ${border} ${navy} hover:bg-[#dbe8f9]`}
                >
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`h-[98px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`p-4 ${navy}`}>
              <h2 className="font-bold text-[15px]">
                Need to reschedule or cancel?
              </h2>
              <p className="mt-2 leading-[1.35]">
                Contact the professional through MYBLIF Chat. Changes are made
                after agreement with the professional.
              </p>
            </CardContent>
          </Card>
        </section>
        <section className="flex flex-col gap-3">
          <Card
            className={`h-[726px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`flex h-full flex-col p-6 ${navy}`}>
              <h2 className="text-lg font-bold">MYBLIF Chat</h2>
              <div className="mt-3 flex flex-1 flex-col gap-6">
                {chatMessages.map((chat, index) => (
                  <div
                    key={`message-${index}`}
                    className={`flex ${
                      chat.type === "professional"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-[14px] border-2 px-4 py-3 leading-[1.35] ${
                        chat.type === "professional"
                          ? `w-[520px] max-w-[90%] bg-[#eaeff4] ${border}`
                          : `w-[440px] max-w-[90%] bg-[#dbe8f9] ${border}`
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
              <form className="mt-4 flex items-center gap-2">
                <Input
                  aria-label="Message"
                  defaultValue=""
                  placeholder="Type your message…"
                  className={`h-[46px] flex-1 rounded-[14px] border-2 bg-white text-[13px] ${border} placeholder:text-[#012878]`}
                />
                <Button
                  type="button"
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#e1efff] p-0 text-base ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Record audio"
                >
                  🎤
                </Button>
                <Button
                  type="button"
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#eef2f7] p-0 text-base ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Attach photo"
                >
                  📷
                </Button>
                <Button
                  type="button"
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#eef2f7] p-0 text-base ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Attach video"
                >
                  🎥
                </Button>
                <Button
                  type="submit"
                  className={`h-[46px] w-[100px] rounded-[10px] border-2 bg-[#fcce5e] font-bold ${border} ${navy} hover:bg-[#f8c343]`}
                >
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
          <Button
            type="button"
            disabled
            className="h-[50px] w-full rounded-[10px] bg-[#b7bcc6] text-sm font-bold text-[#4c515b] opacity-100 hover:bg-[#b7bcc6]"
          >
            Create New Order
          </Button>
        </section>
      </div>
    </main>
  );
};
