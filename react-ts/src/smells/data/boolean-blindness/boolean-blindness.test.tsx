import { render } from "@testing-library/react";
import { Attendees as SmellyAttendees, formatName as smellyFormat } from "./Smelly";
import { Attendees as RefactoredAttendees, formatName } from "./Refactored";

const people = [
  { title: "Dr.", firstName: "Elena", lastName: "Ruiz" },
  { firstName: "Marc", lastName: "Soler" },
];

describe("Boolean Blindness", () => {
  it("the attendee list is identical", () => {
    const { container: a } = render(<SmellyAttendees people={people} />);
    const { container: b } = render(<RefactoredAttendees people={people} />);
    expect(b.textContent).toBe(a.textContent);
    expect(b.textContent).toContain("Dr. Ruiz, Elena / ELENA RUIZ");
  });

  it("every boolean combination has a named equivalent", () => {
    const p = people[0];
    expect(formatName(p, { style: "formal", letterCase: "upper" })).toBe(smellyFormat(p, true, true));
    expect(formatName(p, { style: "casual" })).toBe(smellyFormat(p, false, false));
  });
});
