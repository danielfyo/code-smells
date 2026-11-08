"""Same warehouse flow using only the order's public interface."""

from types import ModuleType

from code_smells.couplers.inappropriate_intimacy import refactored, smelly


def run(module: ModuleType) -> tuple[list[bool], list[tuple[object, list[str]]]]:
    warehouse = module.Warehouse({"A": 2, "B": 1})
    orders = [module.Order("1", {"A": 2}), module.Order("2", {"A": 1, "B": 1})]
    results = [warehouse.fulfil(o) for o in orders] + [warehouse.fulfil(orders[0])]
    return results, [(o._status, list(o._history)) for o in orders]


def test_same_flow() -> None:
    assert run(smelly) == run(refactored)
    assert run(refactored)[0] == [True, False, False]
