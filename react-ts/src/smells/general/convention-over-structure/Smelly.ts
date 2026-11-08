// SMELL: convention over structure. Notification kinds are strings and every function has
// its own switch. Adding a new kind requires "remembering to add a case" everywhere; if
// one is forgotten, the default hides it with no compile error.

// IMPORTANT: if you add a new kind, remember to update iconFor() AND labelFor().
export type NotificationKind = string;

export function iconFor(kind: NotificationKind): string {
  switch (kind) {
    case "order":
      return "📦";
    case "payment":
      return "💳";
    case "refund":
      return "↩️";
    default:
      return "❔";
  }
}

export function labelFor(kind: NotificationKind): string {
  switch (kind) {
    case "order":
      return "New order";
    case "payment":
      return "Payment received";
    // SMELL: someone added "refund" to iconFor but forgot this case.
    default:
      return "Notification";
  }
}
