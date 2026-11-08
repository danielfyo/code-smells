// SMELL: Alternative Classes with Different Interfaces. Two classes do the same
// job (notify a customer) but with different names and signatures, so they are
// not interchangeable and the client code has to tell them apart by hand.
export class EmailService {
  readonly outbox: string[] = [];
  sendEmail(address: string, subject: string, body: string): boolean {
    this.outbox.push(`EMAIL ${address} [${subject}] ${body}`);
    return true;
  }
}

export class SmsGateway {
  readonly sent: string[] = [];
  dispatchText(text: string, phoneNumber: string): number {
    // SMELL: different argument order and different return type (a numeric code).
    this.sent.push(`SMS ${phoneNumber} ${text}`);
    return 200;
  }
}

export interface Customer {
  name: string;
  email?: string;
  phone?: string;
}

// SMELL: the client knows both APIs and branches with instanceof.
export function notifyShipment(channels: (EmailService | SmsGateway)[], customer: Customer, orderId: string): number {
  let delivered = 0;
  for (const channel of channels) {
    if (channel instanceof EmailService && customer.email) {
      if (channel.sendEmail(customer.email, "Order shipped", `Hi ${customer.name}, your order ${orderId} is on its way`)) {
        delivered++;
      }
    } else if (channel instanceof SmsGateway && customer.phone) {
      if (channel.dispatchText(`Hi ${customer.name}, your order ${orderId} is on its way`, customer.phone) === 200) {
        delivered++;
      }
    }
  }
  return delivered;
}
