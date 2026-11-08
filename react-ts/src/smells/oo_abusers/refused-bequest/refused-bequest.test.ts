import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe("Refused Bequest", () => {
  it("both versions handle regular accounts the same way", () => {
    const a1 = new Smelly.BankAccount("a", 100);
    const b1 = new Smelly.BankAccount("b", 0);
    a1.transferTo(b1, 30);
    const a2 = new Refactored.BankAccount("a", 100);
    const b2 = new Refactored.BankAccount("b", 0);
    a2.transferTo(b2, 30);
    expect([a2.getBalance(), b2.getBalance()]).toEqual([a1.getBalance(), b1.getBalance()]);
  });

  it("the smelly subclass breaks a client written for the base class", () => {
    const shop = new Smelly.BankAccount("shop", 0);
    const card = new Smelly.GiftCard("g", 50);
    expect(() => Smelly.payAll([card], shop, 10)).toThrow("does not support transfers");
  });

  it("the refactored version lets you pay with a gift card", () => {
    const shop = new Refactored.BankAccount("shop", 0);
    const card = new Refactored.GiftCard("g", 50);
    const account = new Refactored.BankAccount("acc", 20);
    Refactored.payAll([card, account], shop, 10);
    expect([card.getBalance(), account.getBalance(), shop.getBalance()]).toEqual([40, 10, 20]);
    expect("deposit" in card).toBe(false);
  });
});
