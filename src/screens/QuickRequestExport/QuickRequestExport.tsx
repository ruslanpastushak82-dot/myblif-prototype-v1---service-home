import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { LocationAutocomplete } from "../../components/LocationAutocomplete";
import { SERVICE_CATEGORY_TITLES } from "../../data/serviceCategories";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import {
  getMediaCounts,
  MEDIA_REJECTION_MESSAGES,
  validateMediaFile,
} from "../../lib/mediaLimits";
import type { MediaRejectionReason } from "../../lib/mediaLimits";
import {
  getMissingRequiredFields,
  useCustomerRequest,
} from "../../state/CustomerRequestContext";

const navy = "text-[#012878]";
const controlClass =
  "h-11 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm text-[#012878] shadow-none";
const controlErrorClass = "border-[#c0392b]";
const optionClass =
  "h-11 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm text-[#012878] shadow-none";

const clientTypes = ["Private", "Business"];
const urgencyOptions = ["Urgent", "Not Urgent"];
const preferredPeriods = ["Morning", "Afternoon", "Any time"];
const notificationOptions = ["SMS", "WhatsApp", "Both"];
const propertyTypeOptions = [
  "House",
  "Apartment / Condo",
  "Commercial Property",
  "Other",
];

// Customer flow fix (owner-approved 2026-09-28): selected vs. resting
// state previously used the *same* background/text color
// (data-[state=on] repeated the resting bg-[#eef2f7]/text-[#012878]), so a
// real Context selection had no visible difference from "nothing picked
// yet". Selected now fills navy with white text -- the same pattern the
// Appointment Confirm/Decline buttons already use elsewhere in this app --
// with no change to size/border-radius/layout.
const OptionGroup = ({
  options,
  value,
  onChange,
  widths = "w-[150px]",
  error = false,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  widths?: string;
  error?: boolean;
}) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={(next) => next && onChange(next)}
    className="flex flex-wrap justify-start gap-3"
  >
    {options.map((option) => (
      <ToggleGroupItem
        key={option}
        value={option}
        className={cn(
          widths,
          optionClass,
          error ? controlErrorClass : "",
          "data-[state=on]:border-[#012878] data-[state=on]:bg-[#012878] data-[state=on]:text-white data-[state=on]:hover:bg-[#012878]",
        )}
      >
        {option}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

export const QuickRequestExport = (): JSX.Element => {
  const navigate = useNavigate();
  const { request, updateDraft, addMedia, removeMedia, submitRequest } =
    useCustomerRequest();

  const [formError, setFormError] = useState<string[] | null>(null);
  const [mediaReminderVisible, setMediaReminderVisible] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  // Security hardening (file limits, owner-approved 2026-09-28): short,
  // specific reason shown when a picked photo/video is rejected -- reset
  // to null as soon as a batch is picked with nothing rejected.
  const [mediaError, setMediaError] = useState<string | null>(null);

  const photoCaptureRef = useRef<HTMLInputElement>(null);
  const photoChooseRef = useRef<HTMLInputElement>(null);
  const videoCaptureRef = useRef<HTMLInputElement>(null);
  const videoChooseRef = useRef<HTMLInputElement>(null);

  // Customer flow fix: single source of truth for which controls get the
  // error-state border -- recomputed only when a submit attempt runs (see
  // handleSubmit), never on every keystroke, so a field's border sets once
  // and clears once instead of flickering as the customer types.
  const isMissing = (label: string) => formError?.includes(label) ?? false;

  const updateDraftAndClearError = (
    patch: Parameters<typeof updateDraft>[0],
    label: string,
  ) => {
    updateDraft(patch);
    setFormError((current) => {
      if (!current?.includes(label)) return current;
      const next = current.filter((item) => item !== label);
      return next.length > 0 ? next : null;
    });
  };

  const handleDictation = (transcript: string) => {
    updateDraft({
      requestDetails: request.requestDetails
        ? `${request.requestDetails} ${transcript}`
        : transcript,
    });
  };
  const { isSupported: micSupported, start: startDictation } =
    useSpeechToText(handleDictation);

  const handleFilesSelected =
    (kind: "photo" | "video") => (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        // Security hardening (file limits): validate type, size AND the
        // per-order photo/video cap *before* anything is added to state
        // or gets an object URL (validateMediaFile never creates one) --
        // a rejected file never reaches addMedia. Running counters (not
        // just the pre-batch count) so picking many files at once still
        // caps correctly, e.g. selecting 11 photos in one go only adds up
        // to the limit and rejects the rest.
        const counts = getMediaCounts(request);
        let photoCount = counts.photos;
        let videoCount = counts.videos;
        let rejectionReason: MediaRejectionReason | null = null;

        Array.from(files).forEach((file) => {
          const result = validateMediaFile(file, kind, {
            photos: photoCount,
            videos: videoCount,
          });
          if (!result.ok) {
            if (!rejectionReason) rejectionReason = result.reason;
            return;
          }
          if (kind === "photo") {
            photoCount += 1;
          } else {
            videoCount += 1;
          }
          addMedia(file, kind);
        });

        setMediaError(
          rejectionReason ? MEDIA_REJECTION_MESSAGES[rejectionReason] : null,
        );
      }
      // Reset so selecting the exact same file again still fires onChange.
      event.target.value = "";
    };

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const normalizePhoneForOtp = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.startsWith("+")) {
      return `+${trimmed.slice(1).replace(/\D/g, "")}`;
    }
    const digits = trimmed.replace(/\D/g, "");
    return digits.length === 10 ? `+1${digits}` : `+${digits}`;
  };

  const maskPhone = (phone: string) => {
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, 2)} ••• ••• ${phone.slice(-4)}`;
  };

  const sendOtp = async () => {
    if (otpSending) return;
    const phone = normalizePhoneForOtp(request.mobileNumber);
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setOtpError("Enter a valid mobile number with country code.");
      return;
    }

    setOtpSending(true);
    setOtpError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setOtpSending(false);

    if (error) {
      setOtpError(error.message);
      return;
    }

    setOtpPhone(phone);
    setOtpCode("");
    setOtpVerified(false);
    setOtpOpen(true);
    setResendSeconds(60);
  };

  const verifyOtp = async () => {
    if (otpVerifying || otpCode.length !== 6) return;
    setOtpVerifying(true);
    setOtpError(null);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: otpPhone,
      token: otpCode,
      type: "sms",
    });

    setOtpVerifying(false);
    if (error || !data.session) {
      setOtpError(error?.message ?? "Phone verification failed.");
      return;
    }

    setOtpVerified(true);
  };

  const resendOtp = async () => {
    if (resendSeconds > 0 || otpSending) return;
    setOtpSending(true);
    setOtpError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: otpPhone });
    setOtpSending(false);

    if (error) {
      setOtpError(error.message);
      return;
    }

    setOtpCode("");
    setResendSeconds(60);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const missing = getMissingRequiredFields(request);
    if (missing.length > 0) {
      setFormError(missing);
      setMediaReminderVisible(false);
      return;
    }
    setFormError(null);

    const hasMedia = request.photos.length > 0 || request.videos.length > 0;
    if (!hasMedia) {
      setMediaReminderVisible(true);
      return;
    }

    await sendOtp();
  };

  const mediaCount = request.photos.length + request.videos.length;

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
          <Select defaultValue="en">
            <SelectTrigger className="mt-[58px] h-auto w-[92px] rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2 py-2 text-base font-bold text-[#012878] shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🌐 EN</SelectItem>
            </SelectContent>
          </Select>
        </header>
        <form
          className="grid w-full grid-cols-[minmax(0,584px)_minmax(0,472px)] gap-[70px]"
          onSubmit={handleSubmit}
        >
          <section
            className="flex flex-col gap-0"
            aria-label="Request information"
          >
            <fieldset>
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Service Type *
              </legend>
              {/*
                Single Select covering every Service Home category (was 6
                separate Select boxes, each pinned to its own fixed value —
                a layout bug fixed here per the approved Stage 1 scope).
              */}
              <Select
                value={request.serviceType || undefined}
                onValueChange={(value) =>
                  updateDraftAndClearError({ serviceType: value }, "Service Type")
                }
              >
                <SelectTrigger
                  className={cn(
                    controlClass,
                    isMissing("Service Type") ? controlErrorClass : "",
                  )}
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORY_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </fieldset>
            <fieldset className="mt-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Request Details *
              </legend>
              <div className="relative">
                <Textarea
                  aria-label="Request details"
                  value={request.requestDetails}
                  onChange={(event) =>
                    updateDraft({ requestDetails: event.target.value })
                  }
                  placeholder="Describe what you need, what the problem is, or what you would like us to do…"
                  className={cn(
                    "h-[212px] resize-none rounded-[10px] border-2 border-[#012878] bg-white px-3.5 py-4 text-sm text-[#012878] placeholder:text-[#7a7a7a]",
                    isMissing("Request Details") ? controlErrorClass : "",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={startDictation}
                  disabled={!micSupported}
                  title={
                    micSupported
                      ? "Dictate request details"
                      : "Voice input isn't supported in this browser"
                  }
                  className="absolute bottom-2.5 right-2.5 h-[52px] w-[52px] rounded-[10px] border-[#012878] bg-[#e1efff] p-0 text-sm text-[#012878] hover:bg-[#d5e8ff] disabled:opacity-40"
                >
                  🎤
                </Button>
              </div>
            </fieldset>
            <fieldset className="mt-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Attachments{mediaCount > 0 ? ` (${mediaCount})` : ""}
              </legend>
              <div className="grid grid-cols-4 gap-[15px]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => photoCaptureRef.current?.click()}
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-2.5 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  📷&nbsp;&nbsp;Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => photoChooseRef.current?.click()}
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  Choose Photo
                  {request.photos.length > 0 ? ` (${request.photos.length})` : ""}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoCaptureRef.current?.click()}
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-2.5 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  🎥&nbsp;&nbsp;Record Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoChooseRef.current?.click()}
                  className="h-10 rounded-[10px] border-2 border-[#012878] bg-white px-3 text-sm font-normal text-[#012878] hover:bg-[#f7fbff]"
                >
                  Choose Video
                  {request.videos.length > 0 ? ` (${request.videos.length})` : ""}
                </Button>
              </div>
              {mediaError && (
                <p className="mt-2 text-xs font-bold text-[#c0392b]">
                  {mediaError}
                </p>
              )}
              {/*
                Customer flow fix: pending photo/video preview -- thumbnail
                per file, click to open the full file in a new tab, and a
                remove (×) control that calls the existing removeMedia()
                (unchanged) so a file can still be dropped before Send.
                request.photos/videos ARE the pending, not-yet-sent list
                here (Quick Request submits them as part of the order on
                Send) -- Take Photo/Record Video/file-input plumbing above
                is untouched.
              */}
              {mediaCount > 0 && (
                <div
                  aria-label="Selected media"
                  className="mt-3 flex flex-wrap gap-3"
                >
                  {request.photos.map((item) => (
                    <div key={item.id} className="relative h-[62px] w-[62px]">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(item.url, "_blank", "noopener,noreferrer")
                        }
                        title={item.name}
                        aria-label={`View ${item.name}`}
                        className="h-full w-full overflow-hidden rounded-[7px] border-2 border-[#012878] bg-[#eef2f7]"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeMedia(item.id, "photo")}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#012878] bg-white text-xs font-bold leading-none text-[#012878] hover:bg-[#eef2f7]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {request.videos.map((item) => (
                    <div key={item.id} className="relative h-[62px] w-[62px]">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(item.url, "_blank", "noopener,noreferrer")
                        }
                        title={item.name}
                        aria-label={`View ${item.name}`}
                        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[7px] border-2 border-[#012878] bg-[#eef2f7]"
                      >
                        <video
                          src={item.url}
                          muted
                          className="h-full w-full object-cover"
                        />
                        <span className="pointer-events-none absolute text-lg text-white drop-shadow">
                          ▶
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeMedia(item.id, "video")}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#012878] bg-white text-xs font-bold leading-none text-[#012878] hover:bg-[#eef2f7]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/*
                Customer flow fix: compact missing-fields list lives here,
                directly under Attachments, instead of at the bottom of the
                right column -- set once per failed submit attempt (see
                handleSubmit), not re-rendered on every keystroke, so it
                appears/disappears once rather than flickering.
              */}
              {formError && (
                <p className="mt-3 text-xs font-bold text-[#c0392b]">
                  Please fill in: {formError.join(", ")}
                </p>
              )}
              {/*
                Camera/video capture is implemented via <input type="file"
                capture>, not a custom getUserMedia camera UI (per Stage 1
                scope): on mobile this opens the real camera, on desktop
                Chrome it falls back to the normal file picker.
              */}
              <input
                ref={photoCaptureRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFilesSelected("photo")}
              />
              <input
                ref={photoChooseRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected("photo")}
              />
              <input
                ref={videoCaptureRef}
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={handleFilesSelected("video")}
              />
              <input
                ref={videoChooseRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected("video")}
              />
            </fieldset>
          </section>
          <section className="flex flex-col" aria-label="Request preferences">
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Client Type *
              </legend>
              <OptionGroup
                options={clientTypes}
                value={request.clientType}
                onChange={(value) =>
                  updateDraftAndClearError({ clientType: value }, "Client Type")
                }
                error={isMissing("Client Type")}
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Urgency
              </legend>
              <OptionGroup
                options={urgencyOptions}
                value={request.urgency}
                onChange={(value) => updateDraft({ urgency: value })}
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Preferred Period
              </legend>
              <OptionGroup
                options={preferredPeriods}
                value={request.preferredPeriod}
                onChange={(value) => updateDraft({ preferredPeriod: value })}
                widths="w-24"
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Notifications *
              </legend>
              <OptionGroup
                options={notificationOptions}
                value={request.notifications}
                onChange={(value) =>
                  updateDraftAndClearError({ notifications: value }, "Notifications")
                }
                widths="w-24"
                error={isMissing("Notifications")}
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Contact *
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  aria-label="Name"
                  value={request.name}
                  onChange={(event) =>
                    updateDraftAndClearError({ name: event.target.value }, "Name")
                  }
                  placeholder="Name"
                  className={cn(
                    controlClass,
                    isMissing("Name") ? controlErrorClass : "",
                  )}
                />
                <Input
                  aria-label="Mobile Number"
                  value={request.mobileNumber}
                  onChange={(event) =>
                    updateDraftAndClearError(
                      { mobileNumber: event.target.value },
                      "Mobile Number",
                    )
                  }
                  placeholder="Mobile Number"
                  className={cn(
                    controlClass,
                    isMissing("Mobile Number") ? controlErrorClass : "",
                  )}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[13px] text-[#012878]">
                  <Checkbox
                    checked={request.privateNumber}
                    onCheckedChange={(checked) =>
                      updateDraft({ privateNumber: checked === true })
                    }
                    className="h-[18px] w-[18px] rounded-[3px] border-[#012878] bg-white data-[state=checked]:bg-[#012878]"
                  />
                  Keep my phone number private
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 w-[172px] rounded-[10px] border-2 border-[#012878] bg-[#eef2f7] px-3 text-sm font-normal text-[#012878] hover:bg-white"
                    >
                      ?&nbsp;&nbsp;How it works
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-w-[260px] border-2 border-[#012878] p-3 text-xs leading-[1.4] text-[#012878]">
                    When enabled, your real mobile number stays hidden from
                    the professional. Calls and messages go through MYBLIF
                    instead, and your number is only shared if you choose to.
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Approximate Location *
              </legend>
              {/*
                Customer flow fix (owner-approved 2026-09-28): searchable
                autocomplete over a real, if still static/finite, city list
                (src/data/locations.ts) instead of a 6-value hardcoded
                <Select>. A true nationwide/real-time lookup needs an
                external geocoding/places API + key -- intentionally not
                connected here, see the fix report.
              */}
              <LocationAutocomplete
                value={request.approximateLocation}
                onChange={(value) =>
                  updateDraftAndClearError(
                    { approximateLocation: value },
                    "Approximate Location",
                  )
                }
                error={isMissing("Approximate Location")}
              />
            </fieldset>
            <fieldset className="mb-[18px]">
              <legend className={`mb-2 text-sm font-bold ${navy}`}>
                Property Type
              </legend>
              <Select
                value={request.propertyType || undefined}
                onValueChange={(value) => updateDraft({ propertyType: value })}
              >
                <SelectTrigger className={controlClass}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </fieldset>
            <div className="mt-auto flex flex-col gap-3">
              {mediaReminderVisible && (
                <div className="rounded-[10px] border-2 border-[#012878] bg-[#fff7e0] p-3 text-xs text-[#012878]">
                  <p className="font-bold">No photos or video attached yet.</p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMediaReminderVisible(false)}
                      className="h-9 flex-1 rounded-[10px] border-2 border-[#012878] bg-white text-xs font-bold text-[#012878] hover:bg-[#f7fbff]"
                    >
                      Add photos/video
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void sendOtp()}
                      className="h-9 flex-1 rounded-[10px] border-2 border-[#012878] bg-[#fcce5e] text-xs font-bold text-[#012878] hover:bg-[#ffd978]"
                    >
                      Continue without media
                    </Button>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                disabled={otpSending}
                className="h-[50px] rounded-[10px] border-2 border-[#012878] bg-[#fcce5e] text-base font-bold text-[#012878] hover:bg-[#ffd978] disabled:opacity-60"
              >
                {otpSending ? "Sending..." : "Send Request"}
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

      {otpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#012878]/35 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-verification-title"
        >
          <div className="w-full max-w-[420px] rounded-[16px] border-2 border-[#012878] bg-white p-6 shadow-xl">
            <h2
              id="phone-verification-title"
              className="text-center text-2xl font-bold text-[#012878]"
            >
              Verify your phone
            </h2>
            <p className="mt-2 text-center text-sm text-[#4c515b]">
              Enter the 6-digit code sent to {maskPhone(otpPhone)}
            </p>

            {!otpVerified ? (
              <>
                <Input
                  aria-label="6-digit verification code"
                  value={otpCode}
                  onChange={(event) =>
                    setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="000000"
                  className="mt-5 h-14 rounded-[10px] border-2 border-[#012878] bg-white text-center text-2xl tracking-[0.45em] text-[#012878]"
                />

                {otpError && (
                  <p className="mt-3 text-center text-xs font-bold text-[#c0392b]">
                    {otpError}
                  </p>
                )}

                <Button
                  type="button"
                  onClick={() => void verifyOtp()}
                  disabled={otpVerifying || otpCode.length !== 6}
                  className="mt-5 h-12 w-full rounded-[10px] border-2 border-[#012878] bg-[#fcce5e] font-bold text-[#012878] hover:bg-[#ffd978] disabled:opacity-60"
                >
                  {otpVerifying ? "Verifying..." : "Verify & Submit"}
                </Button>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void resendOtp()}
                    disabled={resendSeconds > 0 || otpSending}
                    className="h-10 flex-1 rounded-[10px] border-2 border-[#012878] text-sm text-[#012878]"
                  >
                    {resendSeconds > 0
                      ? `Resend code (${resendSeconds}s)`
                      : otpSending
                        ? "Sending..."
                        : "Resend code"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpOpen(false);
                      setOtpCode("");
                      setOtpError(null);
                    }}
                    className="h-10 flex-1 rounded-[10px] border-2 border-[#012878] text-sm text-[#012878]"
                  >
                    Change phone
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-[10px] border-2 border-[#012878] bg-[#eef7ee] p-4 text-center text-sm text-[#012878]">
                <p className="font-bold">Phone verified.</p>
                <p className="mt-1">
                  Your request has not been submitted yet. Request creation is
                  connected in the next step.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
