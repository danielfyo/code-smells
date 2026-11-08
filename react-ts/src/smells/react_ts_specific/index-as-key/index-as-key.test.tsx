import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GuestList as Smelly } from "./Smelly";
import { GuestList as Refactored } from "./Refactored";

const guests = [
  { id: "g1", name: "Anna" },
  { id: "g2", name: "Luke" },
];

async function writeNoteForAnnaAndReverse() {
  await userEvent.type(screen.getByLabelText("Note for Anna"), "vegetarian");
  await userEvent.click(screen.getByRole("button", { name: "Reverse" }));
}

describe("index-as-key", () => {
  it("smelly: after reordering, Anna's note shows up next to Luke", async () => {
    render(<Smelly initialGuests={guests} />);
    await writeNoteForAnnaAndReverse();
    expect(screen.getByLabelText("Note for Luke")).toHaveValue("vegetarian");
    expect(screen.getByLabelText("Note for Anna")).toHaveValue("");
  });

  it("refactored: the note travels with its guest", async () => {
    render(<Refactored initialGuests={guests} />);
    await writeNoteForAnnaAndReverse();
    expect(screen.getByLabelText("Note for Anna")).toHaveValue("vegetarian");
    expect(screen.getByLabelText("Note for Luke")).toHaveValue("");
  });
});
