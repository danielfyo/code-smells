import { render, screen } from "@testing-library/react";
import { BookingCard as SmellyCard, SmellyBookingExample } from "./Smelly";
import { BookingCard as RefactoredCard, RefactoredBookingExample } from "./Refactored";

describe("Long Parameter List", () => {
  it("both examples produce the same HTML", () => {
    const { container: a } = render(<SmellyBookingExample />);
    const { container: b } = render(<RefactoredBookingExample />);
    expect(b.innerHTML).toBe(a.innerHTML);
    expect(screen.getAllByText("Total: 285.00 EUR")).toHaveLength(2);
  });

  it("compact mode without price matches as well", () => {
    const { container: a } = render(
      <SmellyCard
        guestName="Ian"
        guestEmail="ian@hotel.test"
        checkIn="2026-01-10"
        checkOut="2026-01-11"
        roomType="Single"
        adults={1}
        children={0}
        nightlyRate={60}
        currency="EUR"
        nights={1}
        showPrice={false}
        compact={true}
      />,
    );
    const { container: b } = render(
      <RefactoredCard
        guest={{ name: "Ian", email: "ian@hotel.test" }}
        stay={{ checkIn: "2026-01-10", checkOut: "2026-01-11", roomType: "Single", nights: 1, adults: 1, children: 0 }}
        rate={{ nightly: 60, currency: "EUR" }}
        display={{ showPrice: false, compact: true }}
      />,
    );
    expect(b.innerHTML).toBe(a.innerHTML);
    expect(screen.queryByText(/ian@hotel.test/)).not.toBeInTheDocument();
  });
});
