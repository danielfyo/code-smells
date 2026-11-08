"""Building range validators for form fields (smelly version)."""

from collections.abc import Callable

LIMITS = {"age": 120, "rating": 5, "quantity": 99}


# SMELL: Late Binding Closures. The lambdas created in the loop capture the VARIABLE
# `limit`, not its value at that iteration. When they run, the loop has finished and all of
# them see the last value (99): the "rating" validator accepts a 50.
def build_validators() -> dict[str, Callable[[int], bool]]:
    validators = {}
    for field, limit in LIMITS.items():
        validators[field] = lambda value: 0 <= value <= limit
    return validators
