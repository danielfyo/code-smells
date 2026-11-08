import pytest

from . import refactored, smelly


@pytest.mark.parametrize("nights", [2, 7])
def test_same_total(nights: int) -> None:
    old = smelly.make_booking("Anne", nights, 80.0)
    new = refactored.Booking("Anne", nights, 80.0)
    assert smelly.booking_total(old) == new.total()


def test_smelly_typo_goes_unnoticed() -> None:
    booking = smelly.mark_paid(smelly.make_booking("Anne", 2, 80.0))
    assert booking["paid"] is False  # bug! "payed" was written instead


def test_refactored_typo_is_an_immediate_error() -> None:
    booking = refactored.Booking("Anne", 2, 80.0)
    booking.mark_paid()
    assert booking.paid is True
    with pytest.raises(AttributeError):
        booking.payed = True  # type: ignore[attr-defined]
