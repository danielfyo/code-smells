"""The inventory behaves the same without the lazy classes."""

from code_smells.dispensables.lazy_class import refactored, smelly


def test_same_inventory_behaviour() -> None:
    old, new = smelly.Inventory(), refactored.Inventory()
    for inv in (old, new):
        inv.add(" ab-1 ", 3)
        inv.add("AB-1", 1)
        inv.add("cd-2", 10)
        inv.add("ef-3", 2)
    assert old.items == new.items
    assert old.low_stock() == new.low_stock() == ["AB-1", "EF-3"]
