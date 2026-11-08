import { render } from "@testing-library/react";
import { Greeting as SmellyGreeting, type User as SmellyUser } from "./Smelly";
import { Greeting as RefactoredGreeting, findUser, GUEST, type User } from "./Refactored";

const smellyUsers: SmellyUser[] = [
  { name: "Kim", preferences: { language: "en", theme: "dark" } },
  { name: "Lola", preferences: null },
  { name: "Max", preferences: { language: null, theme: "dark" } },
];
const users: User[] = [
  { name: "Kim", preferences: { language: "en", theme: "dark" } },
  { name: "Lola" },
  { name: "Max", preferences: { theme: "dark" } },
];

describe("Null Abuse", () => {
  it.each(["Kim", "Lola", "Max", "Nobody"])("same greeting for %s", (name) => {
    const { container: a } = render(<SmellyGreeting users={smellyUsers} name={name} />);
    const { container: b } = render(<RefactoredGreeting users={users} name={name} />);
    expect(b.innerHTML).toBe(a.innerHTML);
  });

  it("findUser never returns null", () => {
    expect(findUser(users, "Nobody")).toBe(GUEST);
    expect(findUser(users, "Lola").preferences).toEqual({ language: "es", theme: "light" });
  });
});
