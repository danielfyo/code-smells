"""Refactored version: each employee type is a class with its own behaviour."""

from abc import ABC, abstractmethod
from dataclasses import dataclass


# REFACTOR: Replace Conditional with Polymorphism. Each branch of the switch becomes
# an overridden method; adding a new type = adding a class, without touching the others.
@dataclass
class Employee(ABC):
    name: str
    base: float
    hours: float = 0

    @abstractmethod
    def monthly_pay(self) -> float: ...

    @abstractmethod
    def vacation_days(self) -> int: ...

    @abstractmethod
    def payslip_title(self) -> str: ...


class SalariedEmployee(Employee):
    def monthly_pay(self) -> float:
        return self.base / 12

    def vacation_days(self) -> int:
        return 23

    def payslip_title(self) -> str:
        return f"Monthly payslip - {self.name}"


class HourlyEmployee(Employee):
    def monthly_pay(self) -> float:
        return self.base * self.hours

    def vacation_days(self) -> int:
        return 15

    def payslip_title(self) -> str:
        return f"Hourly payslip - {self.name}"


class Contractor(Employee):
    def monthly_pay(self) -> float:
        return self.base * self.hours * 1.1

    def vacation_days(self) -> int:
        return 0

    def payslip_title(self) -> str:
        return f"Contractor invoice - {self.name}"


# REFACTOR: Replace Type Code with Subclasses. The only place that knows the type
# codes is this factory (useful when reading external data).
EMPLOYEE_TYPES: dict[str, type[Employee]] = {
    "salaried": SalariedEmployee,
    "hourly": HourlyEmployee,
    "contractor": Contractor,
}


def employee_from(kind: str, name: str, base: float, hours: float = 0) -> Employee:
    try:
        return EMPLOYEE_TYPES[kind](name, base, hours)
    except KeyError:
        raise ValueError(kind) from None
