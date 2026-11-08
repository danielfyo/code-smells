"""Same results without navigation chains in the client."""

from code_smells.couplers.message_chains import refactored, smelly


def build(m):
    return m.Booking(m.Customer("Ana", m.Address("Lisbon", m.Country("PT", 0.23))), 150.0)


def test_same_results() -> None:
    old, new = build(smelly), build(refactored)
    assert smelly.booking_gross_price(old) == refactored.booking_gross_price(new) == 184.5
    assert smelly.booking_country_code(old) == refactored.booking_country_code(new) == "PT"
