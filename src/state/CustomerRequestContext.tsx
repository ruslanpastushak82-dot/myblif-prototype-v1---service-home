import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "confirmed"
  | "rescheduled"
  | "rework"
  | "declined"
  | "completed";

// Professional-side workflow lifecycle (Stage 2A). Deliberately a separate
// field/vocabulary from the Customer-facing `status` above and from any
// future Estimate status -- Stage 2A explicitly does not invent a mapping
// between these layers, beyond a submitted request always starting at
// "new_order". Transitions past "new_order" (Under Review -> ... ->
// Completed) are not driven by any UI yet -- that's a later stage. Stage
// 2B (MYBLIF Chat) does not change this either: sending/receiving chat
// messages never moves this status automatically.
export type ProfessionalWorkflowStatus =
  | "new_order"
  | "under_review"
  | "awaiting_response"
  | "approved"
  | "completed";

export type AppointmentDecision = "pending" | "confirmed" | "declined";

export type MediaKind = "photo" | "video";

export type MediaFile = {
  id: string;
  file: File;
  url: string;
  kind: MediaKind;
  name: string;
};

export type ChatAttachment = {
  id: string;
  url: string;
  kind: MediaKind;
  name: string;
};

export type ChatMessage = {
  id: string;
  from: "customer" | "professional";
  text: string;
  attachments?: ChatAttachment[];
  createdAt: number;
};

export type Appointment = {
  date: string;
  time: string;
  duration: string;
  price: string;
};

export type CustomerRequest = {
  id: string | null;
  reference: string | null;
  status: RequestStatus;
  // System/MYBLIF data, not something the Customer types -- set once, at
  // Send Request, never edited afterwards.
  submittedAt: number | null;
  // Professional-side workflow lifecycle (Stage 2A groundwork). Starts at
  // "new_order" the moment a request is submitted; null while still a
  // draft (not submitted yet).
  professionalStatus: ProfessionalWorkflowStatus | null;
  // Separate flag, not a lifecycle stage (see ProfessionalWorkflowStatus
  // doc comment). Not settable by the Customer or inferred from their
  // input -- defaults false, reserved for the Professional side later.
  critical: boolean;
  serviceType: string;
  requestDetails: string;
  photos: MediaFile[];
  videos: MediaFile[];
  clientType: string;
  urgency: string;
  preferredPeriod: string;
  notifications: string;
  name: string;
  mobileNumber: string;
  privateNumber: boolean;
  approximateLocation: string;
  propertyType: string;
  appointment: Appointment | null;
  appointmentDecision: AppointmentDecision;
  // Single shared conversation for this order -- both Customer's Request +
  // MYBLIF Chat and Professional's Order Details MYBLIF Chat read and
  // append to this exact array (via reference), never a separate copy.
  messages: ChatMessage[];
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const emptyCustomerRequest = (): CustomerRequest => ({
  id: null,
  reference: null,
  status: "draft",
  submittedAt: null,
  professionalStatus: null,
  critical: false,
  serviceType: "",
  requestDetails: "",
  photos: [],
  videos: [],
  clientType: "",
  urgency: "",
  preferredPeriod: "",
  notifications: "",
  name: "",
  mobileNumber: "",
  privateNumber: false,
  approximateLocation: "",
  propertyType: "",
  appointment: null,
  appointmentDecision: "pending",
  messages: [],
});

type RequiredField = { key: keyof CustomerRequest; label: string };

// "Мінімально необхідні" поля для Send Request — не про весь UI, лише те,
// без чого заявка не має сенсу (фото/відео свідомо не обов'язкові, це
// перевіряється окремо м'яким reminder-ом на екрані Quick Request).
// Customer flow fix (owner-approved 2026-09-28): Urgency, Preferred
// Period and Property Type are no longer required for Send Request;
// Notifications now is. Photo/video and the "keep my number private"
// checkbox remain optional (unchanged, checked separately/not at all).
const REQUIRED_FIELDS: RequiredField[] = [
  { key: "serviceType", label: "Service Type" },
  { key: "requestDetails", label: "Request Details" },
  { key: "clientType", label: "Client Type" },
  { key: "notifications", label: "Notifications" },
  { key: "name", label: "Name" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "approximateLocation", label: "Approximate Location" },
];

export const getMissingRequiredFields = (request: CustomerRequest): string[] =>
  REQUIRED_FIELDS.filter(({ key }) => {
    const value = request[key];
    return typeof value === "string" && value.trim() === "";
  }).map(({ label }) => label);

export type PendingChatAttachment = { file: File; kind: MediaKind };

export type CustomerRequestContextValue = {
  // The in-progress draft that Service Home / Quick Request read and
  // write, exactly as in Stage 1 -- not yet part of `requests` until
  // submitRequest() succeeds.
  request: CustomerRequest;
  // Every submitted order (Stage 2A: in-memory only, no backend/
  // localStorage). This is what Professional's Project List reads.
  requests: CustomerRequest[];
  // The specific submitted order the Customer's Request + MYBLIF Chat
  // screen is currently showing (the one just created by Send Request,
  // or none if the Customer hasn't submitted anything yet this session).
  activeRequest: CustomerRequest | null;
  setServiceType: (serviceType: string) => void;
  clearServiceType: () => void;
  updateDraft: (patch: Partial<CustomerRequest>) => void;
  addMedia: (file: File, kind: MediaKind) => void;
  removeMedia: (id: string, kind: MediaKind) => void;
  submitRequest: () => { ok: true } | { ok: false; missing: string[] };
  setAppointmentDecision: (decision: "confirmed" | "declined") => void;
  // Customer side (Stage 1/2A, unchanged): always targets whichever order
  // is currently `activeRequest`.
  sendMessage: (text: string, attachments?: PendingChatAttachment[]) => void;
  // Professional side (Stage 2B): targets an explicit order by reference,
  // since Professional can open any order directly via
  // /service-order/:reference, independent of the Customer's own
  // activeRequest. Appends to the exact same `messages[]` array as
  // sendMessage above -- one shared conversation per order, no copy.
  sendProfessionalMessage: (reference: string, text: string) => void;
  startNewOrder: () => void;
  isReadOnly: boolean;
  // Professional-side lookup: find a submitted order by its reference
  // (used by Order Details, /service-order/:reference).
  getRequestByReference: (reference: string) => CustomerRequest | undefined;
};

const CustomerRequestContext = createContext<
  CustomerRequestContextValue | undefined
>(undefined);

/**
 * Shared Customer + Professional state (Stage 2A/2B). Still deliberately
 * just React Context + useState -- no backend, no persistence library,
 * nothing survives a page reload. Mounted once above both the Customer
 * route group (Service Home -> Quick Request -> Request+Chat) and the
 * Professional routes (Project List, Order Details) -- see App.tsx -- so
 * a request submitted on the Customer side, and every MYBLIF Chat message
 * either side sends afterwards, is immediately visible to the other side
 * in the same browser tab/session.
 */
export const CustomerRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [draft, setDraft] = useState<CustomerRequest>(emptyCustomerRequest);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [activeReference, setActiveReference] = useState<string | null>(null);

  // Tracks every object URL this provider has ever created (attached
  // photos/videos + chat attachments) so it can revoke all of them on
  // unmount. Individual draft-stage media URLs are revoked as soon as
  // they're removed via removeMedia (before Send Request). Once a request
  // is submitted, its media/chat-attachment URLs are deliberately *not*
  // revoked by submitRequest() or startNewOrder() any more (Stage 2A
  // change from Stage 1): the submitted order keeps living in `requests`
  // for the Professional side to view (Customer Media, chat attachments),
  // so its object URLs must stay valid for as long as the order exists in
  // memory. Only a full provider unmount (e.g. page reload) revokes
  // everything, which is an acceptable boundary for this in-memory-only
  // prototype (no backend/localStorage per Stage 2A/2B scope).
  const objectUrls = useRef<Set<string>>(new Set());

  const registerUrl = useCallback((url: string) => {
    objectUrls.current.add(url);
    return url;
  }, []);

  const revokeUrl = useCallback((url: string) => {
    if (objectUrls.current.has(url)) {
      URL.revokeObjectURL(url);
      objectUrls.current.delete(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    };
  }, []);

  const setServiceType = useCallback((serviceType: string) => {
    setDraft((prev) => ({ ...prev, serviceType }));
  }, []);

  const clearServiceType = useCallback(() => {
    setDraft((prev) => ({ ...prev, serviceType: "" }));
  }, []);

  const updateDraft = useCallback((patch: Partial<CustomerRequest>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const addMedia = useCallback(
    (file: File, kind: MediaKind) => {
      const url = registerUrl(URL.createObjectURL(file));
      const entry: MediaFile = {
        id: createId(),
        file,
        url,
        kind,
        name: file.name,
      };
      setDraft((prev) => ({
        ...prev,
        photos: kind === "photo" ? [...prev.photos, entry] : prev.photos,
        videos: kind === "video" ? [...prev.videos, entry] : prev.videos,
      }));
    },
    [registerUrl],
  );

  const removeMedia = useCallback(
    (id: string, kind: MediaKind) => {
      setDraft((prev) => {
        const list = kind === "photo" ? prev.photos : prev.videos;
        const target = list.find((item) => item.id === id);
        if (target) revokeUrl(target.url);
        const nextList = list.filter((item) => item.id !== id);
        return {
          ...prev,
          photos: kind === "photo" ? nextList : prev.photos,
          videos: kind === "video" ? nextList : prev.videos,
        };
      });
    },
    [revokeUrl],
  );

  const submitRequest = useCallback(() => {
    const missing = getMissingRequiredFields(draft);
    if (missing.length > 0) {
      return { ok: false as const, missing };
    }

    const reference = `MYB-S26-${Math.floor(100000 + Math.random() * 900000)}`;

    // Everything below this line is system/MYBLIF data (reference,
    // submittedAt, initial professionalStatus) or explicit Stage 1
    // defaults (status, appointmentDecision) -- not anything rewritten,
    // corrected or generated from what the Customer entered. Every other
    // field is copied from `draft` unchanged, word for word (the `...draft`
    // spread). Per Stage 2A scope, appointment starts at null (the Stage 1
    // hardcoded placeholder proposal is removed) and messages start empty
    // (no auto-generated Professional message) -- Estimate/Appointment is
    // a later, separate stage.
    const submitted: CustomerRequest = {
      ...draft,
      id: createId(),
      reference,
      status: "submitted",
      submittedAt: Date.now(),
      professionalStatus: "new_order",
      critical: false,
      appointment: null,
      appointmentDecision: "pending",
      messages: [],
    };

    setRequests((prev) => [...prev, submitted]);
    setActiveReference(reference);
    // Reset the draft so Service Home / Quick Request start clean for a
    // possible next request -- this does NOT touch the submitted order's
    // own copy of the data (or its media object URLs), which now lives
    // independently in `requests`.
    setDraft(emptyCustomerRequest());

    return { ok: true as const };
  }, [draft]);

  const setAppointmentDecision = useCallback(
    (decision: "confirmed" | "declined") => {
      if (!activeReference) return;
      setRequests((prev) =>
        prev.map((item) => {
          if (item.reference !== activeReference) return item;
          // Security hardening (pre-Stage-2C audit): a Completed order is
          // read-only at the Context level too, not just via UI disabled
          // attributes -- this guard still applies even if a caller
          // bypasses the UI (e.g. dev tools) and invokes the function
          // directly. Completed is intentionally the only status this
          // checks (not e.g. "declined") -- that matches the existing
          // isReadOnly definition (`status === "completed"`) this app
          // already treats as final.
          if (item.status === "completed") return item;
          return { ...item, appointmentDecision: decision, status: decision };
        }),
      );
    },
    [activeReference],
  );

  const sendMessage = useCallback(
    (text: string, attachments?: PendingChatAttachment[]) => {
      if (!activeReference) return;
      const trimmed = text.trim();
      const pending = attachments ?? [];
      if (!trimmed && pending.length === 0) return;

      const chatAttachments: ChatAttachment[] = pending.map((item) => ({
        id: createId(),
        url: registerUrl(URL.createObjectURL(item.file)),
        kind: item.kind,
        name: item.file.name,
      }));

      const message: ChatMessage = {
        id: createId(),
        from: "customer",
        text: trimmed,
        attachments: chatAttachments.length > 0 ? chatAttachments : undefined,
        createdAt: Date.now(),
      };

      setRequests((prev) =>
        prev.map((item) => {
          if (item.reference !== activeReference) return item;
          // Same Context-level Completed guard as setAppointmentDecision
          // above -- Customer cannot append a message to a Completed
          // order even by calling sendMessage directly, regardless of
          // whether the UI's own `isReadOnly` disabled the input.
          if (item.status === "completed") return item;
          return { ...item, messages: [...item.messages, message] };
        }),
      );
    },
    [activeReference, registerUrl],
  );

  // Professional side of the same shared conversation (Stage 2B). Unlike
  // Customer's sendMessage, this targets an explicit `reference` (the
  // order Professional currently has open via /service-order/:reference)
  // rather than `activeReference` -- Professional never has an "active"
  // order the way Customer does. Appends to the very same `messages[]`
  // array on the matching entry in `requests`, so both sides are reading
  // and writing one shared array, never separate copies. Text-only for
  // now (no attachments): TechnicianChatSection has no real file-input
  // wiring behind its 🎤/📷/🎥 buttons yet, and Stage 2B doesn't add new
  // UI to create one.
  const sendProfessionalMessage = useCallback(
    (reference: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const message: ChatMessage = {
        id: createId(),
        from: "professional",
        text: trimmed,
        createdAt: Date.now(),
      };

      setRequests((prev) =>
        prev.map((item) => {
          if (item.reference !== reference) return item;
          // Same Context-level Completed guard -- Professional cannot
          // write into a Completed order's chat either, even by calling
          // this function directly for that reference. History remains
          // readable (nothing here touches existing item.messages).
          if (item.status === "completed") return item;
          return { ...item, messages: [...item.messages, message] };
        }),
      );
    },
    [],
  );

  const startNewOrder = useCallback(() => {
    // The just-completed order stays in `requests` as-is (Professional
    // still needs to see it) -- only the Customer's own "what am I looking
    // at right now" pointer and draft are cleared.
    setActiveReference(null);
    setDraft(emptyCustomerRequest());
  }, []);

  const activeRequest = useMemo(
    () => requests.find((item) => item.reference === activeReference) ?? null,
    [requests, activeReference],
  );

  const getRequestByReference = useCallback(
    (reference: string) =>
      requests.find((item) => item.reference === reference),
    [requests],
  );

  const isReadOnly = activeRequest?.status === "completed";

  // Dev-only QA hook: the Professional side has no UI yet to move a
  // request through reviewed/rescheduled/rework/completed (Customer's own
  // status) -- exposed only in dev builds, not part of any UI, used only
  // to verify the Completed -> read-only / Create New Order gating for
  // whichever order the Customer currently has open.
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__setCustomerRequestStatus =
        (status: RequestStatus) => {
          if (!activeReference) return;
          setRequests((prev) =>
            prev.map((item) =>
              item.reference === activeReference ? { ...item, status } : item,
            ),
          );
        };
    }
  }, [activeReference]);

  const value = useMemo<CustomerRequestContextValue>(
    () => ({
      request: draft,
      requests,
      activeRequest,
      setServiceType,
      clearServiceType,
      updateDraft,
      addMedia,
      removeMedia,
      submitRequest,
      setAppointmentDecision,
      sendMessage,
      sendProfessionalMessage,
      startNewOrder,
      isReadOnly,
      getRequestByReference,
    }),
    [
      draft,
      requests,
      activeRequest,
      setServiceType,
      clearServiceType,
      updateDraft,
      addMedia,
      removeMedia,
      submitRequest,
      setAppointmentDecision,
      sendMessage,
      sendProfessionalMessage,
      startNewOrder,
      isReadOnly,
      getRequestByReference,
    ],
  );

  return (
    <CustomerRequestContext.Provider value={value}>
      {children}
    </CustomerRequestContext.Provider>
  );
};

export const useCustomerRequest = (): CustomerRequestContextValue => {
  const ctx = useContext(CustomerRequestContext);
  if (!ctx) {
    throw new Error(
      "useCustomerRequest must be used within a CustomerRequestProvider",
    );
  }
  return ctx;
};
