import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm as Smelly } from "./Smelly";
import { ContactForm as Refactored } from "./Refactored";

function failingOnceSubmit() {
  return vi.fn().mockRejectedValueOnce(new Error("Server unavailable")).mockResolvedValue(undefined);
}

async function fillAndSubmitTwice() {
  await userEvent.type(screen.getByLabelText("Name"), "Anna");
  await userEvent.type(screen.getByLabelText("Email"), "anna@shop.com");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Server unavailable");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Message sent");
}

describe("useState-explosion", () => {
  it("smelly shows error and success at the same time (impossible state)", async () => {
    const submit = failingOnceSubmit();
    render(<Smelly submit={submit} />);
    await fillAndSubmitTwice();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(submit).toHaveBeenLastCalledWith({ name: "Anna", email: "anna@shop.com" });
  });

  it("refactored can only be in one submit state", async () => {
    const submit = failingOnceSubmit();
    render(<Refactored submit={submit} />);
    await fillAndSubmitTwice();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(submit).toHaveBeenLastCalledWith({ name: "Anna", email: "anna@shop.com" });
  });
});
