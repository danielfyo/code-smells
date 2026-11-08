"""Building range validators for form fields."""

from collections.abc import Callable
from functools import partial

LIMITS = {"age": 120, "rating": 5, "quantity": 99}


def _within_range(limit: int, value: int) -> bool:
    return 0 <= value <= limit


# REFACTOR: Bind Value Early. `functools.partial` fixes the value of `limit` when each
# validator is created (equivalent alternative: `lambda value, limit=limit: ...`).
def build_validators() -> dict[str, Callable[[int], bool]]:
    return {field: partial(_within_range, limit) for field, limit in LIMITS.items()}
