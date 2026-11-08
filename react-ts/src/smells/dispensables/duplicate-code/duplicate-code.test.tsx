import { fireEvent, render, screen } from "@testing-library/react";
import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

describe.each([
  ["Smelly", Smelly],
  ["Refactored", Refactored],
])("Duplicate Code (%s)", (_label, impl) => {
  it("newsletter: rejects an invalid email and accepts a valid one", () => {
    const onSubscribe = vi.fn();
    render(<impl.NewsletterForm onSubscribe={onSubscribe} />);
    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "nope" } });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email");
    fireEvent.change(input, { target: { value: "  Pepa@Mail.ES " } });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSubscribe).toHaveBeenCalledWith("pepa@mail.es");
  });

  it("contact: sends the normalized email and the message", () => {
    const onSend = vi.fn();
    render(<impl.ContactForm onSend={onSend} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "LUIS@mail.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("luis@mail.com", "Hello");
  });
});

it("the extracted rule can be tested on its own", () => {
  expect(Refactored.normalizeEmail("a@b.c")).toBeNull();
  expect(Refactored.normalizeEmail(" A@B.CO ")).toBe("a@b.co");
});
