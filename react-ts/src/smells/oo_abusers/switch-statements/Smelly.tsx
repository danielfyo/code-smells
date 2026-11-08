export type NotificationKind = "comment" | "mention" | "invoice" | "system";

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  author?: string;
  amount?: number;
  text: string;
}

// SMELL: Repeated Switches. The same `switch (kind)` appears in three functions.
// Adding a new kind ("follow") means finding and editing every one of them.
function iconFor(kind: NotificationKind): string {
  switch (kind) {
    case "comment":
      return "💬";
    case "mention":
      return "@";
    case "invoice":
      return "€";
    case "system":
      return "⚙";
  }
}

function titleFor(n: AppNotification): string {
  switch (n.kind) {
    case "comment":
      return `${n.author} commented`;
    case "mention":
      return `${n.author} mentioned you`;
    case "invoice":
      return `New invoice for ${n.amount?.toFixed(2)} €`;
    case "system":
      return "System notice";
  }
}

function isUrgent(n: AppNotification): boolean {
  switch (n.kind) {
    case "invoice":
      return (n.amount ?? 0) > 1000;
    case "system":
      return true;
    default:
      return false;
  }
}

export function NotificationList({ items }: { items: AppNotification[] }) {
  return (
    <ul>
      {items.map((n) => (
        <li key={n.id} className={isUrgent(n) ? "urgent" : undefined}>
          <span aria-hidden="true">{iconFor(n.kind)}</span> <strong>{titleFor(n)}</strong>: {n.text}
        </li>
      ))}
    </ul>
  );
}
