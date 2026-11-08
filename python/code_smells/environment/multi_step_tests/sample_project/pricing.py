"""Sample module with three kinds of checks: doctests, unit tests and data validation.

>>> apply_discount(100.0, "SUMMER10")
90.0
>>> apply_discount(100.0, "UNKNOWN")
100.0
"""

import json
from pathlib import Path

DISCOUNTS: dict[str, float] = json.loads(
    (Path(__file__).parent / "discounts.json").read_text(encoding="utf-8")
)


def apply_discount(price: float, code: str) -> float:
    """Apply the discount code's percentage (if it exists).

    >>> apply_discount(80.0, "VIP25")
    60.0
    """
    return round(price * (1 - DISCOUNTS.get(code, 0) / 100), 2)
