// REFACTOR: structure enforces the rule. A Record keyed by a union of literals makes the
// compiler demand a complete entry for every kind: forgetting one is a type error,
// not a production bug.
export type NotificationKind = "order" | "payment" | "refund";

interface NotificationMeta {
  icon: string;
  label: string;
}

const NOTIFICATION_META: Record<NotificationKind, NotificationMeta> = {
  order: { icon: "📦", label: "New order" },
  payment: { icon: "💳", label: "Payment received" },
  refund: { icon: "↩️", label: "Refund issued" },
};

export function iconFor(kind: NotificationKind): string {
  return NOTIFICATION_META[kind].icon;
}

export function labelFor(kind: NotificationKind): string {
  return NOTIFICATION_META[kind].label;
}
