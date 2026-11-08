import { render, screen } from "@testing-library/react";
import { NotificationList as SmellyList } from "./Smelly";
import { NotificationList as RefactoredList, type AppNotification } from "./Refactored";

const items: AppNotification[] = [
  { id: 1, kind: "comment", author: "Leo", text: "Great job!" },
  { id: 2, kind: "mention", author: "Sara", text: "look at this" },
  { id: 3, kind: "invoice", amount: 1500, text: "due on Monday" },
  { id: 4, kind: "invoice", amount: 20, text: "coffee" },
  { id: 5, kind: "system", text: "maintenance at 3:00" },
];

describe("Switch Statements", () => {
  it("both lists show the same text and the same urgency flags", () => {
    const { container: a } = render(<SmellyList items={items} />);
    const { container: b } = render(<RefactoredList items={items} />);
    expect(b.textContent).toBe(a.textContent);
    const classes = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.className);
    expect(classes(b)).toEqual(classes(a));
  });

  it("flags large invoices and system notices as urgent", () => {
    const { container } = render(<RefactoredList items={items} />);
    expect(container.querySelectorAll("li.urgent")).toHaveLength(2);
    expect(screen.getByText("New invoice for 1500.00 €")).toBeInTheDocument();
  });
});
