import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

const customers = [
  { name: "Ana", email: "ana@mail.com", phone: "600111222" },
  { name: "Luis", phone: "600333444" },
  { name: "Noa" },
];

describe("Alternative Classes with Different Interfaces", () => {
  it.each(customers)("delivers the same messages to $name", (customer) => {
    const email1 = new Smelly.EmailService();
    const sms1 = new Smelly.SmsGateway();
    const count1 = Smelly.notifyShipment([email1, sms1], customer, "P-7");

    const email2 = new Refactored.EmailNotifier();
    const sms2 = new Refactored.SmsNotifier();
    const count2 = Refactored.notifyShipment([email2, sms2], customer, "P-7");

    expect(count2).toBe(count1);
    expect(email2.outbox).toEqual(email1.outbox);
    expect(sms2.sent).toEqual(sms1.sent);
  });

  it("a new channel only needs to implement Notifier", () => {
    const log: string[] = [];
    const push: Refactored.Notifier = { notify: (c, m) => (log.push(`${c.name}:${m.subject}`), true) };
    expect(Refactored.notifyShipment([push], { name: "Eva" }, "P-1")).toBe(1);
    expect(log).toEqual(["Eva:Order shipped"]);
  });
});
