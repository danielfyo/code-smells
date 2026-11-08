export type NotificationKind = "comment" | "mention" | "invoice" | "system";

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  author?: string;
  amount?: number;
  text: string;
}

// REFACTOR: Replace Conditional with Polymorphism (functional flavour): each
// kind declares its behaviour in a single object. A new kind = a new entry.
interface KindBehavior {
  icon: string;
  title: (n: AppNotification) => string;
  urgent: (n: AppNotification) => boolean;
}

const never = (): boolean => false;

// REFACTOR: `Record<NotificationKind, ...>` makes TypeScript demand an entry for
// every kind: forgetting one is a compile error, not a silent bug.
const behaviors: Record<NotificationKind, KindBehavior> = {
  comment: { icon: "💬", title: (n) => `${n.author} commented`, urgent: never },
  mention: { icon: "@", title: (n) => `${n.author} mentioned you`, urgent: never },
  invoice: {
    icon: "€",
    title: (n) => `New invoice for ${n.amount?.toFixed(2)} €`,
    urgent: (n) => (n.amount ?? 0) > 1000,
  },
  system: { icon: "⚙", title: () => "System notice", urgent: () => true },
};

function NotificationItem({ notification }: { notification: AppNotification }) {
  const behavior = behaviors[notification.kind];
  return (
    <li className={behavior.urgent(notification) ? "urgent" : undefined}>
      <span aria-hidden="true">{behavior.icon}</span> <strong>{behavior.title(notification)}</strong>:{" "}
      {notification.text}
    </li>
  );
}

export function NotificationList({ items }: { items: AppNotification[] }) {
  return (
    <ul>
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </ul>
  );
}
