import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { useSpeechToText } from "../../../../hooks/useSpeechToText";
import {
  getMediaCounts,
  MEDIA_REJECTION_MESSAGES,
  validateMediaFile,
} from "../../../../lib/mediaLimits";
import type {
  MediaKind,
  RequestStatus,
} from "../../../../state/CustomerRequestContext";
import {
  emptyCustomerRequest,
  useCustomerRequest,
} from "../../../../state/CustomerRequestContext";

const statusLabels: { label: string; value: RequestStatus }[] = [
  { label: "Submitted", value: "submitted" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Rescheduled", value: "rescheduled" },
  { label: "Rework", value: "rework" },
  { label: "Declined", value: "declined" },
  { label: "Completed", value: "completed" },
];

const navy = "text-[#012878]";
const border = "border-[#012878]";

// A file picked via 📷/🎥 but not sent yet. Deliberately holds just the raw
// File (+ a local id for list keys/removal) -- no object URL is created
// until Send actually happens, so there's nothing to revoke if the
// customer removes it before sending.
type PendingAttachment = {
  id: string;
  file: File;
  kind: MediaKind;
};

const createLocalId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `pending-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const MainContentSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    activeRequest,
    setAppointmentDecision,
    sendMessage,
    startNewOrder,
    isReadOnly,
  } = useCustomerRequest();
  // Stage 2A: Request + Chat now shows the specific submitted order
  // (`activeRequest`), which can briefly be null (e.g. this screen opened
  // directly, with nothing submitted yet this session) -- fall back to an
  // empty display-only request rather than crashing. Every `request.*`
  // reference below is unchanged from Stage 1.
  const [backendRequest, setBackendRequest] = useState<any>(null);
  const [storedMessages, setStoredMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const request = backendRequest ?? activeRequest ?? emptyCustomerRequest();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!activeRequest?.id) return;
    const load = async () => {
      const { data } = await supabase.from("requests").select("*").eq("id", activeRequest.id).maybeSingle();
      if (data) setBackendRequest({ ...activeRequest, status: data.status, professionalStatus: data.professional_status, appointmentDecision: data.appointment_decision, appointment: data.appointment_date ? { date: data.appointment_date, time: data.appointment_arrival_time ?? "", duration: data.appointment_duration_minutes ? `${data.appointment_duration_minutes} min` : "", price: "" } : null });
      const { data: chat } = await supabase.from("messages").select("id,text,sender_id,created_at").eq("request_id", activeRequest.id).is("offer_id", null).order("created_at");
      if (chat) setStoredMessages(chat);
    };
    void load();
  }, [activeRequest?.id]);

  // Stage 2B §4 (Appointment safety): while there's no real Appointment yet
  // (request.appointment === null), Confirm/Decline stay disabled and
  // appointmentDecision stays pending -- no fake date/time/duration/price.
  // This is on top of the existing isReadOnly (Completed) gating.
  const appointmentActionsDisabled = isReadOnly || !request.appointment;

  const [chatDraft, setChatDraft] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<
    PendingAttachment[]
  >([]);
  // Security hardening (file limits, owner-approved 2026-09-28): short,
  // specific reason shown when a picked chat photo/video is rejected --
  // shares the exact same limits/messages as Quick Request (src/lib/
  // mediaLimits.ts) so the two entry points never diverge.
  const [mediaError, setMediaError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleDictation = (transcript: string) => {
    setChatDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };
  const { isSupported: micSupported, start: startDictation } =
    useSpeechToText(handleDictation);

  const canSend =
    !isReadOnly && (chatDraft.trim() !== "" || pendingAttachments.length > 0);

  const handleChatSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isReadOnly) return;
    const trimmed = chatDraft.trim();
    if (!trimmed && pendingAttachments.length === 0) return;
    if (request.id) {
      void supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) return;
        const { data: inserted, error } = await supabase.from("messages").insert({ request_id: request.id, sender_id: data.user.id, text: trimmed }).select("id,text,sender_id,created_at").single();
        if (!error && inserted) setStoredMessages((prev) => [...prev, inserted]);
      });
    } else {
      sendMessage(trimmed, pendingAttachments.map(({ file, kind }) => ({ file, kind })));
    }
    setChatDraft("");
    setPendingAttachments([]);
  };

  const handlePickAttachment =
    (kind: MediaKind) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Security hardening (file limits): the per-order cap covers this
        // order's already-submitted media AND anything already sent via
        // this same chat (getMediaCounts) PLUS whatever is already staged
        // here but not sent yet (pendingAttachments) -- so the 10-photo /
        // 3-video cap holds across both upload entry points and across
        // multiple chat messages, not just per single pick. Validated (and
        // rejected) before any object URL is created / state is touched.
        const committed = getMediaCounts(request);
        const pendingPhotos = pendingAttachments.filter(
          (item) => item.kind === "photo",
        ).length;
        const pendingVideos = pendingAttachments.filter(
          (item) => item.kind === "video",
        ).length;
        const result = validateMediaFile(file, kind, {
          photos: committed.photos + pendingPhotos,
          videos: committed.videos + pendingVideos,
        });
        if (!result.ok) {
          setMediaError(MEDIA_REJECTION_MESSAGES[result.reason]);
        } else {
          setMediaError(null);
          setPendingAttachments((prev) => [
            ...prev,
            { id: createLocalId(), file, kind },
          ]);
        }
      }
      event.target.value = "";
    };

  const handleRemovePending = (id: string) => {
    if (isReadOnly) return;
    setPendingAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // Customer flow fix (owner-approved 2026-09-28): lets the customer open
  // a pending (not-yet-sent) photo/video before hitting Send. Deliberately
  // a throwaway, view-only object URL -- created on click, revoked a
  // minute later -- separate from the persisted URLs sendMessage() creates
  // for attachments that actually get sent. Does not touch
  // handleRemovePending/handleChatSubmit/pendingAttachments state at all.
  const handleViewPending = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const attachments = [
    ...request.photos.map((item, index) => ({
      id: item.id,
      icon: "📷",
      label: `Photo ${index + 1}`,
      url: item.url,
    })),
    ...request.videos.map((item, index) => ({
      id: item.id,
      icon: "▶",
      label: `Video ${index + 1}`,
      url: item.url,
    })),
  ];

  const handleCreateNewOrder = () => {
    if (request.status !== "completed") return;
    startNewOrder();
    navigate("/quick-request-u8212-export-diagnostic");
  };

  return (
    <main className="mx-auto flex w-full max-w-[1250px] flex-col gap-3 px-3 py-4 text-[13px] [font-family:'Inter',Helvetica] md:px-0">
      {/*
        Read-only status indicators — the Customer doesn't drive this bar
        anymore (it used to be a set of clickable buttons with local state).
        The current status only moves in response to real actions: Send
        Request -> submitted, Confirm/Decline -> confirmed/declined; the
        remaining statuses (Reviewed/Rescheduled/Rework/Completed) will be
        set from the Professional side once that's wired up.
      */}
      <nav
        aria-label="Request status"
        className={`flex w-full gap-2.5 overflow-x-auto rounded-[14px] border-2 bg-white p-4 lg:max-w-[1226px] ${border}`}
      >
        {statusLabels.map(({ label, value }) => (
          <div
            key={value}
            aria-current={request.status === value ? "true" : undefined}
            className={`flex h-[42px] min-w-[130px] flex-1 items-center justify-center rounded-[10px] border text-[13px] font-bold ${
              request.status === value
                ? "border-[#012878] bg-[#012878] text-white"
                : "border-[#012878] bg-[#eef2f7] text-[#012878]"
            }`}
          >
            {label}
          </div>
        ))}
      </nav>
      <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,560px)_minmax(0,654px)]">
        <section className="flex flex-col gap-3">
          <Card
            className={`h-[444px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`p-6 ${navy}`}>
              <h2 className="text-lg font-bold">Request Details</h2>
              <div className="mt-3 space-y-3">
                <p>Name: {request.name || "—"}</p>
                <p>Client Type: {request.clientType || "—"}</p>
                <p>Service: {request.serviceType || "—"}</p>
                <p className="max-w-[500px] leading-[1.35]">
                  Request: {request.requestDetails || "—"}
                </p>
                {request.urgency && <p>Urgency: {request.urgency}</p>}
                {request.preferredPeriod && (
                  <p>Preferred Period: {request.preferredPeriod}</p>
                )}
                <p>Location: {request.approximateLocation || "—"}</p>
                {request.propertyType && (
                  <p>Property Type: {request.propertyType}</p>
                )}
              </div>
              <h3 className="mt-4 font-bold text-[13px]">Attachments</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {attachments.length === 0 && (
                  <p className="text-xs text-[#5e6e85]">No attachments</p>
                )}
                {attachments.map((attachment) => (
                  <Button
                    key={attachment.id}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        attachment.url,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
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
            className={`h-[261px] rounded-[14px] border-2 bg-white ${border}`}
          >
            <CardContent className={`p-6 ${navy}`}>
              <h2 className="text-lg font-bold">Appointment</h2>
              <p className="mt-2 text-base font-bold">
                Date: {request.appointment?.date ?? "—"}
              </p>
              <p className="text-base">
                Time: {request.appointment?.time ?? "—"}
              </p>
              <div className="mt-3 space-y-1 text-black">
                <p>
                  Estimated duration: {request.appointment?.duration ?? "—"}
                </p>
                <p>Estimated price: {request.appointment?.price ?? "—"}</p>
                <p className="text-xs">
                  Final price may change after on-site inspection if additional
                  work or parts are required.
                </p>
              </div>
              <div className="mt-2 flex justify-between gap-3 px-3">
                <Button
                  type="button"
                  disabled={appointmentActionsDisabled}
                  onClick={() => request.id ? void supabase.rpc("respond_to_service_appointment", { p_request_id: request.id, p_decision: "declined" }).then(({ data }) => { if (data) setBackendRequest((prev: any) => ({ ...prev, status: "rescheduled", professionalStatus: "under_review", appointmentDecision: "declined" })); }) : setAppointmentDecision("declined")}
                  className={`h-[42px] flex-1 rounded-[10px] border-2 font-bold disabled:opacity-50 ${border} ${
                    request.appointmentDecision === "declined"
                      ? "bg-[#012878] text-white hover:bg-[#012878]"
                      : `bg-[#eef2f7] ${navy} hover:bg-[#dbe8f9]`
                  }`}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  disabled={appointmentActionsDisabled}
                  onClick={() => request.id ? void supabase.rpc("respond_to_service_appointment", { p_request_id: request.id, p_decision: "confirmed" }).then(({ data }) => { if (data) setBackendRequest((prev: any) => ({ ...prev, status: "confirmed", professionalStatus: "approved", appointmentDecision: "confirmed" })); }) : setAppointmentDecision("confirmed")}
                  className={`h-[42px] flex-1 rounded-[10px] border-2 font-bold disabled:opacity-50 ${border} ${
                    request.appointmentDecision === "confirmed"
                      ? "bg-[#012878] text-white hover:bg-[#012878]"
                      : `bg-[#eef2f7] ${navy} hover:bg-[#dbe8f9]`
                  }`}
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
              <div className="mt-3 flex flex-1 flex-col gap-6 overflow-y-auto">
                {(request.id && storedMessages.length > 0 ? storedMessages.map((m) => ({ id: m.id, text: m.text, from: m.sender_id === currentUserId ? "customer" : "professional" })) : request.messages).map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex ${
                      chat.from === "professional"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-[14px] border-2 px-4 py-3 leading-[1.35] ${
                        chat.from === "professional"
                          ? `w-[520px] max-w-[90%] bg-[#eaeff4] ${border}`
                          : `w-[440px] max-w-[90%] bg-[#dbe8f9] ${border}`
                      }`}
                    >
                      {chat.text && <p>{chat.text}</p>}
                      {chat.attachments && chat.attachments.length > 0 && (
                        <div className="mt-1 flex flex-col gap-1">
                          {chat.attachments.map((attachment) => (
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
                              className="w-fit underline decoration-dotted text-left"
                            >
                              {attachment.kind === "photo" ? "📷" : "🎥"}{" "}
                              {attachment.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/*
                Compact pending-attachment row: only takes up space when
                there's something staged, so the approved geometry is
                unaffected the rest of the time. Each chip is the file's
                name/type + a View control (Customer flow fix,
                owner-approved 2026-09-28 -- opens the picked file in a new
                tab via a throwaway object URL, see handleViewPending) + the
                existing remove control -- still no persistent thumbnail
                image in the chip itself, no new large UI, no change to
                handleRemovePending/handleChatSubmit.
              */}
              {pendingAttachments.length > 0 && (
                <div
                  aria-label="Pending attachments"
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {pendingAttachments.map((item) => (
                    <span
                      key={item.id}
                      className={`flex max-w-[260px] items-center gap-1.5 rounded-full border bg-[#eef2f7] px-2.5 py-1 text-[11px] ${border} ${navy}`}
                    >
                      <span aria-hidden="true">
                        {item.kind === "photo" ? "📷" : "🎥"}
                      </span>
                      <span className="truncate">{item.file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleViewPending(item.file)}
                        aria-label={`View ${item.file.name}`}
                        className="ml-0.5 leading-none text-[11px] font-bold underline decoration-dotted"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => handleRemovePending(item.id)}
                        aria-label={`Remove ${item.file.name}`}
                        className="ml-0.5 leading-none text-[13px] font-bold disabled:opacity-40"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {mediaError && (
                <p className="mt-2 text-xs font-bold text-[#c0392b]">
                  {mediaError}
                </p>
              )}
              <form
                className="mt-4 flex items-center gap-2"
                onSubmit={handleChatSubmit}
              >
                <Input
                  aria-label="Message"
                  value={chatDraft}
                  onChange={(event) => setChatDraft(event.target.value)}
                  disabled={isReadOnly}
                  placeholder="Type your message…"
                  className={`h-[46px] flex-1 rounded-[14px] border-2 bg-white text-[13px] ${border} placeholder:text-[#012878]`}
                />
                <Button
                  type="button"
                  disabled={isReadOnly || !micSupported}
                  onClick={startDictation}
                  title={
                    micSupported
                      ? "Dictate message"
                      : "Voice input isn't supported in this browser"
                  }
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#e1efff] p-0 text-base disabled:opacity-40 ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Record audio"
                >
                  🎤
                </Button>
                <Button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => photoInputRef.current?.click()}
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#eef2f7] p-0 text-base disabled:opacity-40 ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Attach photo"
                >
                  📷
                </Button>
                <Button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => videoInputRef.current?.click()}
                  className={`h-[46px] w-[52px] rounded-[10px] border bg-[#eef2f7] p-0 text-base disabled:opacity-40 ${border} ${navy} hover:bg-[#dbe8f9]`}
                  aria-label="Attach video"
                >
                  🎥
                </Button>
                <Button
                  type="submit"
                  disabled={!canSend}
                  className={`h-[46px] w-[100px] rounded-[10px] border-2 bg-[#fcce5e] font-bold disabled:opacity-40 ${border} ${navy} hover:bg-[#f8c343]`}
                >
                  Send
                </Button>
              </form>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePickAttachment("photo")}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={handlePickAttachment("video")}
              />
            </CardContent>
          </Card>
          <Button
            type="button"
            disabled={request.status !== "completed"}
            onClick={handleCreateNewOrder}
            className="h-[50px] w-full rounded-[10px] bg-[#b7bcc6] text-sm font-bold text-[#4c515b] opacity-100 hover:bg-[#b7bcc6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create New Order
          </Button>
        </section>
      </div>
    </main>
  );
};
