import { render, screen } from "@testing-library/react";
import { Button as Smelly } from "./Smelly";
import { Button as Refactored } from "./Refactored";

describe("boolean-prop-explosion", () => {
  it("both versions generate the same classes for valid combinations", () => {
    render(
      <>
        <Smelly isDanger isSmall>A</Smelly>
        <Refactored variant="danger" size="sm">B</Refactored>
        <Smelly>C</Smelly>
        <Refactored>D</Refactored>
      </>,
    );
    expect(screen.getByText("A")).toHaveClass("btn-danger", "btn-sm");
    expect(screen.getByText("B").className).toBe(screen.getByText("A").className);
    expect(screen.getByText("D").className).toBe(screen.getByText("C").className);
  });

  it("smelly accepts impossible combinations and silently resolves them", () => {
    render(
      <Smelly isPrimary isDanger isSmall isLarge>
        ??
      </Smelly>,
    );
    expect(screen.getByText("??")).toHaveClass("btn-danger", "btn-lg");
    // In refactored, <Refactored variant="primary" variant="danger"> does not compile.
  });
});
