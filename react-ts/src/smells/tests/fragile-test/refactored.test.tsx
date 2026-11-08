import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "./production";

// REFACTOR: the test interacts like a user (roles, labels, visible text) and verifies
// observable behavior. It survives changes to classes or structure.
describe("NewsletterForm (refactored)", () => {
  it("shows an error and does not subscribe with an invalid email", async () => {
    const onSubscribe = vi.fn();
    render(<NewsletterForm onSubscribe={onSubscribe} />);
    await userEvent.type(screen.getByLabelText("Email"), "anna");
    await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email");
    expect(onSubscribe).not.toHaveBeenCalled();
  });

  it("subscribes with a valid email", async () => {
    const onSubscribe = vi.fn();
    render(<NewsletterForm onSubscribe={onSubscribe} />);
    await userEvent.type(screen.getByLabelText("Email"), "anna@shop.com");
    await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(onSubscribe).toHaveBeenCalledWith("anna@shop.com");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
