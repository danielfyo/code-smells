import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaveDraftButton } from "./production";

// REFACTOR: instead of sleeping, the test controls the promise and waits for the
// observable condition (findBy* retries until it appears). Fast and deterministic.
describe("SaveDraftButton (refactored)", () => {
  it("shows 'Saving…' and then the saved message", async () => {
    let finishSave: () => void = () => undefined;
    const save = () => new Promise<void>((resolve) => (finishSave = resolve));
    render(<SaveDraftButton save={save} />);

    await userEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(screen.getByText("Saving…")).toBeInTheDocument();

    finishSave();
    expect(await screen.findByRole("status")).toHaveTextContent("Draft saved");
  });
});
