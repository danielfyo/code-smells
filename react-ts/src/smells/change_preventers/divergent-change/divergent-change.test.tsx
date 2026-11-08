import { fireEvent, render, screen } from "@testing-library/react";
import { ProfileEditor as SmellyEditor } from "./Smelly";
import { ProfileEditor as RefactoredEditor, validateProfile } from "./Refactored";

describe.each([
  ["Smelly", SmellyEditor],
  ["Refactored", RefactoredEditor],
])("Divergent Change (%s)", (_label, Editor) => {
  it("shows the formatted preview and saves the API payload", () => {
    const onSave = vi.fn();
    render(<Editor initialName=" Irene " initialPhone="600-111-222" onSave={onSave} />);
    expect(screen.getByText(/Preview:/)).toHaveTextContent("Irene · +34 600 111 222");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith({ full_name: "Irene", phone: "+34600111222" });
  });

  it("validates the phone before saving", () => {
    const onSave = vi.fn();
    render(<Editor initialName="Irene" initialPhone="600" onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Phone must have 9 digits");
    expect(onSave).not.toHaveBeenCalled();
  });
});

it("the refactored validation can be tested without rendering anything", () => {
  expect(validateProfile({ name: "A", phone: "600111222" })).toBe("Name is too short");
  expect(validateProfile({ name: "Ana", phone: "600111222" })).toBeNull();
});
