"""Refactored version: the function returns an immutable result."""

from dataclasses import dataclass


@dataclass(frozen=True)
class ValidationResult:
    errors: tuple[str, ...]
    lines: int
    units: int

    @property
    def is_valid(self) -> bool:
        return not self.errors


# REFACTOR: Replace Output Parameter with Return Value. Everything the function
# produces comes out through the return value; arguments are only inputs.
def validate_order(order: dict) -> ValidationResult:
    lines = order.get("lines", [])
    errors = []
    if not order.get("customer"):
        errors.append("Missing customer")
    if not lines:
        errors.append("The order has no lines")
    return ValidationResult(tuple(errors), len(lines), sum(qty for _, qty in lines))
