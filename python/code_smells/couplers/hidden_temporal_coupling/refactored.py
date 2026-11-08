"""Refactored version: the dependencies between steps are explicit in the signatures."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Employee:
    name: str
    gross: float


# REFACTOR: Introduce Parameter Object / complete constructor. Everything needed is
# required when creating the object: a "half-configured" PayrollRun is impossible.
@dataclass(frozen=True)
class PayrollRun:
    employees: tuple[Employee, ...]
    tax_rate: float

    def __post_init__(self) -> None:
        if not 0 <= self.tax_rate < 1:
            raise ValueError("Invalid tax rate")

    # REFACTOR: the only public method no longer depends on previous calls.
    def generate(self) -> list[str]:
        return [f"{e.name}: {e.gross * (1 - self.tax_rate):.2f}" for e in self.employees]


def run_payroll(rows: list[tuple[str, float]], tax_rate: float) -> list[str]:
    return PayrollRun(tuple(Employee(*row) for row in rows), tax_rate).generate()
