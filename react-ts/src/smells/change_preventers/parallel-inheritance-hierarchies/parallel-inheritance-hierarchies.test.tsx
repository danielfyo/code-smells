import { render } from "@testing-library/react";
import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe("Parallel Inheritance Hierarchies", () => {
  it("the summary is the same for card and bank transfer", () => {
    const pairs = [
      [new Smelly.CardPayment(200, "4242"), new Refactored.CardPayment(200, "4242")],
      [new Smelly.BankTransfer(50, "ES9121000418450200051332"), new Refactored.BankTransfer(50, "ES9121000418450200051332")],
    ] as const;
    for (const [s, r] of pairs) {
      const { container: a } = render(<Smelly.PaymentSummary payment={s} />);
      const { container: b } = render(<Refactored.PaymentSummary payment={r} />);
      expect(b.textContent).toBe(a.textContent);
    }
  });

  it("a new payment method does not need a new component", () => {
    class Wallet extends Refactored.PaymentMethod {
      fee() {
        return 0;
      }
      label() {
        return "Wallet";
      }
    }
    const { container } = render(<Refactored.PaymentSummary payment={new Wallet(10)} />);
    expect(container).toHaveTextContent("Wallet — fee 0.00 €");
  });

  it("in the smelly version a new type renders nothing until its twin is created", () => {
    class Wallet extends Smelly.PaymentMethod {
      fee() {
        return 0;
      }
    }
    const { container } = render(<Smelly.PaymentSummary payment={new Wallet(10)} />);
    expect(container).toBeEmptyDOMElement();
  });
});
