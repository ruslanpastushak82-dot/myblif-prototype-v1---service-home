import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useCustomerRequest } from "../../../state/CustomerRequestContext";
import type { CustomerRequest } from "../../../state/CustomerRequestContext";

const mockMessages = [
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

const mockEstimateLines = [
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

export const TechnicianChatSection = ({
  customerRequest,
}: {
  customerRequest?: CustomerRequest;
}): JSX.Element => {
  const { sendProfessionalMessage } = useCustomerRequest();

  // Controlled draft for the Professional's outgoing message. Only wired
  // for a real order (customerRequest present, with its own reference) --
  // the mock/no-order fallback keeps the exact Stage 1 inert behaviour.
  const [draft, setDraft] = useState("");
  const [storedMessages, setStoredMessages] = useState<Array<{ id: string; text: string; sender_id: string }>>([]);

  useEffect(() => {
    if (!customerRequest?.id) return;
    void supabase.from("messages").select("id,text,sender_id").eq("request_id", customerRequest.id).is("offer_id", null).order("created_at").then(({ data, error }) => {
      if (!error && data) setStoredMessages(data);
    });
  }, [customerRequest?.id]);

  // Security hardening (pre-Stage-2C audit): the Professional composer had
  // no Completed-order gating at all before -- UI-level only, mirroring
  // Customer's `isReadOnly` (see Context's `sendProfessionalMessage`
  // guard for the same rule enforced even if this UI check is bypassed).
  // History above stays fully readable either way -- only the composer is
  // disabled.
  const isCompleted = customerRequest?.status === "completed";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerRequest || isCompleted) {
      // No real order open, or order is Completed -- unchanged Stage 1
      // placeholder behaviour / Context guard backs this up regardless.
      return;
    }

    const trimmed = draft.trim();
    if (!trimmed) return;

    if (customerRequest.id) {
      void supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return;
        const { data: inserted, error } = await supabase.from("messages").insert({ request_id: customerRequest.id, sender_id: data.user.id, text: trimmed }).select("id,text,sender_id").single();
        if (!error && inserted) setStoredMessages((prev) => [...prev, inserted]);
      });
    } else {
      sendProfessionalMessage(customerRequest.reference, trimmed);
    }
    setDraft("");
  };

  const messages = customerRequest?.id && storedMessages.length > 0
    ? storedMessages.map((message) => ({
        id: message.id,
        text: message.text,
        className: "w-full max-w-[520px] self-end bg-[#eaeff4]",
      }))
    : customerRequest
    ? customerRequest.messages.map((message) => ({
        id: message.id,
        text: message.text,
        attachments: message.attachments,
        className:
          message.from === "professional"
            ? "w-full max-w-[520px] self-end bg-[#eaeff4]"
            : "w-full max-w-[440px] self-start bg-[#dbe8f9]",
      }))
    : mockMessages;

  return (
    // Fixed, controlled height (was min-h-[440px], which let the card
    // grow without limit as messages were added). History scrolls
    // internally; the composer stays pinned at the bottom.
    <Card className="flex h-[420px] w-full max-w-[822px] flex-col overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-white shadow-none">
      <CardContent className="flex h-full min-h-0 flex-col p-0">
        <section
          aria-labelledby="technician-chat-title"
          className="flex min-h-0 flex-1 flex-col px-6 pb-4 pt-[22px]"
        >
          <h2
            id="technician-chat-title"
            className="shrink-0 [font-family:'Inter',Helvetica] text-lg font-bold leading-normal tracking-[0] text-[#012878]"
          >
            MYBLIF Chat
          </h2>
          <div className="mt-[13px] flex min-h-0 flex-1 flex-col gap-[15px] overflow-y-auto pr-1">
            {messages.length === 0 && customerRequest && (
              <p className="text-sm text-[#5e6e85]">No messages yet.</p>
            )}
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`${message.className} shrink-0 overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] shadow-none`}
              >
                <CardContent className="px-4 py-[15px] [font-family:'Inter',Helvetica] text-sm font-normal leading-normal tracking-[0] text-[#012878]">
                  {message.text && <p>{message.text}</p>}
                  {"attachments" in message &&
                    message.attachments &&
                    message.attachments.length > 0 && (
                      <div className="mt-1 flex flex-col gap-1">
                        {message.attachments.map((attachment) => (
                          <button
                            key={attachment.id}
                            type="button"
                            onClick={() =>
                              window.open(
                                attachment.url,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            className="w-fit text-left underline decoration-dotted"
                          >
                            {attachment.kind === "photo" ? "📷" : "🎥"}{" "}
                            {attachment.name}
                          </button>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}

            {/*
              The Stage 1 estimate card below is Professional-authored
              content (date/time/duration/price the Professional proposes)
              -- per Stage 2A §5 it must not be auto-generated from a
              Customer Request, so it's only shown for the mock/no-order
              fallback. Estimate/Appointment for real orders is a separate
              stage (not Stage 2B).
            */}
            {!customerRequest && (
              <Card className="w-full max-w-[520px] shrink-0 self-end overflow-hidden rounded-[14px] border-2 border-solid border-[#012878] bg-[#eaeff4] shadow-none">
                <CardContent className="px-4 py-[15px] [font-family:'Inter',Helvetica] text-sm font-normal leading-[17px] tracking-[0] text-[#012878]">
                  {mockEstimateLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-[17px] grid shrink-0 grid-cols-[minmax(0,1fr)_52px_52px_52px_118px] gap-2"
          >
            <Input
              aria-label="Message"
              placeholder="Type your message…"
              // Always controlled (even for the mock/no-order fallback) --
              // switching value between a string and undefined depending on
              // customerRequest triggered React's controlled/uncontrolled
              // warning whenever the same mounted /service-order/:reference
              // route re-rendered with a different order. The mock path
              // still ignores `draft` on submit (see handleSubmit), so this
              // is display-only for that case.
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isCompleted}
              className="h-[46px] min-w-0 rounded-[14px] border-2 border-solid border-[#012878] px-4 [font-family:'Inter',Helvetica] text-sm text-[#012878] shadow-none placeholder:text-[#012878] disabled:opacity-50"
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
              disabled={isCompleted}
              className="h-[46px] w-[118px] rounded-[10px] border-2 border-solid border-[#012878] bg-[#fcce5e] p-0 [font-family:'Inter',Helvetica] text-sm font-bold text-[#012878] shadow-none hover:bg-[#fcce5e] hover:brightness-95 disabled:opacity-50"
            >
              Send
            </Button>
          </form>
        </section>
      </CardContent>
    </Card>
  );
};
