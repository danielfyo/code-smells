// Production code: classifying orders by priority.
export type Priority = "low" | "normal" | "high";

export function orderPriority(total: number, isPremium: boolean): Priority {
  if (total < 0) throw new RangeError("Negative total");
  if (isPremium || total >= 500) return "high";
  if (total >= 100) return "normal";
  return "low";
}
