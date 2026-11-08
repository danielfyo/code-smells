import { render } from "@testing-library/react";
import { ShippingLabel as SmellyLabel } from "./Smelly";
import { ShippingLabel as RefactoredLabel, type Address } from "./Refactored";

const addresses: Address[] = [
  { street: "Gran Vía 1", city: "Madrid", postalCode: "28013", country: "ES" },
  { street: "Calle Triana 5", city: "Las Palmas", postalCode: "35002", country: "ES" },
  { street: "Rua Augusta 10", city: "Lisbon", postalCode: "1100-053", country: "PT" },
];

describe("Data Clumps", () => {
  it.each(addresses)("the label is identical for $city", (address) => {
    const { container: a } = render(<SmellyLabel recipient="Martha" {...address} />);
    const { container: b } = render(<RefactoredLabel recipient="Martha" address={address} />);
    expect(b.innerHTML).toBe(a.innerHTML);
  });

  it("computes shipping from the address", () => {
    const { getByText } = render(<RefactoredLabel recipient="Martha" address={addresses[1]} />);
    expect(getByText("Shipping: 9 €")).toBeInTheDocument();
    expect(getByText("Domestic")).toBeInTheDocument();
  });
});
