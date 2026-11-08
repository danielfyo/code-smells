import { act, fireEvent, render, screen } from "@testing-library/react";
import { SaveDraftButton } from "./production";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// SMELL: sleepy test. It "waits" with a fixed sleep, hoping the async operation has
// finished. If saving takes longer (busy CI) the test fails randomly; if it takes less,
// time is wasted on every run.
describe("SaveDraftButton (smelly)", () => {
  it("shows the saved message", async () => {
    const save = () => sleep(50);
    render(<SaveDraftButton save={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    await act(async () => {
      await sleep(150); // SMELL: arbitrary "just in case" wait
    });
    expect(screen.getByRole("status")).toHaveTextContent("Draft saved");
  });
});
