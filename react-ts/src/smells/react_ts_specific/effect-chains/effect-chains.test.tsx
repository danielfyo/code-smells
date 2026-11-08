import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profiler } from "react";
import { ShippingForm as Smelly } from "./Smelly";
import { ShippingForm as Refactored } from "./Refactored";

describe("effect-chains", () => {
  it.each([
    ["smelly", Smelly],
    ["refactored", Refactored],
  ])("%s updates city, cost and summary when the country changes", async (_name, Form) => {
    const onSummary = vi.fn();
    render(<Form onSummary={onSummary} />);
    await userEvent.selectOptions(screen.getByLabelText("Country"), "FR");
    expect(screen.getByLabelText("City")).toHaveValue("Paris");
    expect(screen.getByText("Paris (FR): 12 €")).toBeInTheDocument();
    expect(onSummary).toHaveBeenLastCalledWith("Paris (FR): 12 €");
    await userEvent.selectOptions(screen.getByLabelText("City"), "Lyon");
    expect(onSummary).toHaveBeenLastCalledWith("Lyon (FR): 12 €");
  });

  it("smelly chains several commits for a single change; refactored does one", async () => {
    const commits = { smelly: 0, refactored: 0 };
    render(
      <>
        <Profiler id="smelly" onRender={() => commits.smelly++}>
          <Smelly />
        </Profiler>
        <Profiler id="refactored" onRender={() => commits.refactored++}>
          <Refactored />
        </Profiler>
      </>,
    );
    commits.smelly = 0;
    commits.refactored = 0;
    const [smellyCountry, refactoredCountry] = screen.getAllByLabelText("Country");
    await userEvent.selectOptions(smellyCountry, "FR");
    await userEvent.selectOptions(refactoredCountry, "FR");
    expect(commits.refactored).toBe(1);
    expect(commits.smelly).toBeGreaterThan(1);
  });
});
