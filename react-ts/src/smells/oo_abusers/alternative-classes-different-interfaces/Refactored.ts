export interface Customer {
  name: string;
  email?: string;
  phone?: string;
}

export interface Message {
  subject: string;
  body: string;
}

// REFACTOR: Extract Interface + Rename Method / Change Function Declaration.
// Both classes implement the same `Notifier` contract with the same signature.
export interface Notifier {
  /** Returns true if the channel could deliver the message to that customer. */
  notify(customer: Customer, message: Message): boolean;
}

export class EmailNotifier implements Notifier {
  readonly outbox: string[] = [];
  notify(customer: Customer, { subject, body }: Message): boolean {
    if (!customer.email) return false;
    this.outbox.push(`EMAIL ${customer.email} [${subject}] ${body}`);
    return true;
  }
}

export class SmsNotifier implements Notifier {
  readonly sent: string[] = [];
  notify(customer: Customer, { body }: Message): boolean {
    if (!customer.phone) return false;
    this.sent.push(`SMS ${customer.phone} ${body}`);
    return true;
  }
}

// REFACTOR: the client treats every channel polymorphically.
export function notifyShipment(channels: Notifier[], customer: Customer, orderId: string): number {
  const message = { subject: "Order shipped", body: `Hi ${customer.name}, your order ${orderId} is on its way` };
  return channels.filter((channel) => channel.notify(customer, message)).length;
}
