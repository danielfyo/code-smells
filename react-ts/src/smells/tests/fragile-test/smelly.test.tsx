import { fireEvent, render } from "@testing-library/react";
import { NewsletterForm } from "./production";

// SMELL: fragile test. It is coupled to implementation details: CSS classes, DOM structure
// (children[0]...) and the exact HTML. Renaming a class, wrapping the input in another div
// or changing the order breaks the test even though behavior is identical.
describe("NewsletterForm (smelly)", () => {
  it("shows an error and does not subscribe with an invalid email", () => {
    const onSubscribe = vi.fn();
    const { container } = render(<NewsletterForm onSubscribe={onSubscribe} />);
    const form = container.querySelector(".nl-form") as HTMLFormElement;
    const input = form.children[0].children[1] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "anna" } });
    fireEvent.click(container.querySelector(".btn.btn--primary") as HTMLButtonElement);
    expect(container.querySelector(".nl-form__error")?.outerHTML).toBe(
      '<span class="nl-form__error" role="alert">Please enter a valid email</span>',
    );
    expect(onSubscribe).not.toHaveBeenCalled();
  });

  it("subscribes with a valid email", () => {
    const onSubscribe = vi.fn();
    const { container } = render(<NewsletterForm onSubscribe={onSubscribe} />);
    fireEvent.change(container.querySelector(".nl-form__input") as HTMLInputElement, {
      target: { value: "anna@shop.com" },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);
    expect(onSubscribe).toHaveBeenCalledWith("anna@shop.com");
  });
});
