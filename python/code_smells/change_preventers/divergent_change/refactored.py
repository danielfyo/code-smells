"""Refactored version: each axis of change has its own module/class."""

import json
from collections import defaultdict
from dataclasses import dataclass


@dataclass(frozen=True)
class Sale:
    seller: str
    amount: float


# REFACTOR: Split Phase + Extract Class. Reading, calculation and presentation are
# separated; each class has a single reason to change (SRP).
class CsvSalesReader:
    """Changes only if the input format changes."""

    def read(self, csv_text: str) -> list[Sale]:
        lines = csv_text.strip().splitlines()[1:]
        return [Sale(s.strip(), float(a)) for s, a in (line.split(";") for line in lines)]


class CommissionPolicy:
    """Changes only if the business rules change."""

    def compute(self, sales: list[Sale]) -> dict[str, float]:
        totals: dict[str, float] = defaultdict(float)
        for sale in sales:
            totals[sale.seller] += sale.amount
        return {s: round(t * self.rate_for(t), 2) for s, t in totals.items()}

    @staticmethod
    def rate_for(total: float) -> float:
        return 0.05 if total < 10000 else 0.08


class JsonFormatter:
    def format(self, commissions: dict[str, float]) -> str:
        return json.dumps(commissions, sort_keys=True)


class TextFormatter:
    def format(self, commissions: dict[str, float]) -> str:
        return "\n".join(f"{s}: {c:.2f}" for s, c in sorted(commissions.items()))


def commissions_from_csv(csv_text: str) -> dict[str, float]:
    return CommissionPolicy().compute(CsvSalesReader().read(csv_text))
