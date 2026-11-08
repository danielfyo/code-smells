"""Library statistics: overdue loans."""

from datetime import date
from typing import Any

DAILY_LATE_FEE = 0.25


# REFACTOR: Rename Function / Rename Variable. Every name states its intent
# (`overdue_summary`, `loans`, `today`, `overdue_loans`, `total_fees`); the magic constant
# 0.25 becomes `DAILY_LATE_FEE`. The dict keys are kept for compatibility.
def overdue_summary(loans: list[dict[str, Any]], today: date) -> tuple[int, float]:
    """Return (number of overdue loans, accumulated late fee in euros)."""
    overdue_loans = [loan for loan in loans if loan["r"] is None and loan["due"] < today]
    total_fees = sum((today - loan["due"]).days * DAILY_LATE_FEE for loan in overdue_loans)
    return len(overdue_loans), round(total_fees, 2)
