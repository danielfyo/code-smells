"""Smelly version: a sales report class that changes for very different reasons."""

import json


class SalesReport:
    # SMELL: Divergent Change. This class is modified when the data source changes
    # (CSV format), when the business rules change (commissions) and when the
    # presentation changes (JSON/text). Three independent axes of change in one place.
    def __init__(self, csv_text: str) -> None:
        self.csv_text = csv_text

    def _rows(self) -> list[tuple[str, float]]:
        # Reason to change 1: the input format.
        rows = []
        for line in self.csv_text.strip().splitlines()[1:]:
            seller, amount = line.split(";")
            rows.append((seller.strip(), float(amount)))
        return rows

    def commissions(self) -> dict[str, float]:
        # Reason to change 2: the commission policy.
        totals: dict[str, float] = {}
        for seller, amount in self._rows():
            totals[seller] = totals.get(seller, 0) + amount
        return {s: round(t * (0.05 if t < 10000 else 0.08), 2) for s, t in totals.items()}

    def as_json(self) -> str:
        # Reason to change 3: the output format.
        return json.dumps(self.commissions(), sort_keys=True)

    def as_text(self) -> str:
        return "\n".join(f"{s}: {c:.2f}" for s, c in sorted(self.commissions().items()))
