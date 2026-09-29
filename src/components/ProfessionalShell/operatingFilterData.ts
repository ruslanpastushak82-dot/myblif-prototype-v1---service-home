export type OperatingFilterKey =
  | "critical"
  | "newOrders"
  | "underReview"
  | "awaitingResponse"
  | "approved"
  | "completed";

export type OperatingFilterDefinition = {
  key: OperatingFilterKey;
  label: string;
};

/**
 * Canonical filter order for the shared Operating Filter Bar (Stage 7).
 * This order is the product spec — do not reorder without a new task.
 */
export const operatingFilterDefinitions: OperatingFilterDefinition[] = [
  { key: "critical", label: "Critical" },
  { key: "newOrders", label: "New Orders" },
  { key: "underReview", label: "Under Review" },
  { key: "awaitingResponse", label: "Awaiting Response" },
  { key: "approved", label: "Approved" },
  { key: "completed", label: "Completed" },
];

export type OperatingFilterCounts = Record<OperatingFilterKey, number>;

/**
 * Single centralized prototype data source for Operating Filter Bar counts.
 *
 * This replaces the 5 separate hardcoded status arrays that used to live on
 * each Professional screen. It is intentionally NOT a real backend — it is
 * a placeholder shared source so every screen reads the same counts from
 * one place. Swap this out for a real shared order-state source later
 * without touching OperatingFilterBar.tsx itself.
 */
export const operatingFilterCounts: OperatingFilterCounts = {
  critical: 0,
  newOrders: 8,
  underReview: 3,
  awaitingResponse: 2,
  approved: 1,
  completed: 12,
};
