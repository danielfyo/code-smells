"""Same result; the refactored version also accepts subclasses without touching the base."""

import pytest

from code_smells.oo_abusers.base_class_depends_on_subclass import refactored, smelly


@pytest.mark.parametrize("name", ["Document", "Invoice", "CreditNote"])
def test_same_description(name: str) -> None:
    old = getattr(smelly, name)("2026-7", 120.5)
    new = getattr(refactored, name)("2026-7", 120.5)
    assert old.describe() == new.describe()


def test_new_subclass_without_touching_base() -> None:
    class Receipt(refactored.Document):
        prefix = "TIC"

    assert Receipt("1", 3).describe() == "TIC-1: 3.00"

    class SmellyReceipt(smelly.Document):  # type: ignore[misc]  # smelly is not type-checked
        pass

    # In the smelly version the base does not know the new class and falls into the generic case.
    assert SmellyReceipt("1", 3).describe() == "DOC-1: 3.00"
