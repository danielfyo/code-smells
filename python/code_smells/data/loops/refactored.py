"""Refactored version: collection pipelines that express intent."""

from collections import defaultdict
from typing import Any


def delayed_tracking_codes(shipments: list[dict[str, Any]]) -> list[str]:
    # REFACTOR: Replace Loop with Pipeline. Comprehension + sorted: filtering,
    # transformation and ordering read as a single expression.
    return sorted(s["tracking"].upper() for s in shipments if s["status"] == "DELAYED")


def weight_by_carrier(shipments: list[dict[str, Any]]) -> dict[str, float]:
    # REFACTOR: defaultdict removes the manual key check.
    totals: defaultdict[str, float] = defaultdict(float)
    for s in shipments:
        totals[s["carrier"]] += s["weight"]
    return dict(totals)


def heaviest(shipments: list[dict[str, Any]]) -> str | None:
    # REFACTOR: max() with key and default replaces the helper variables.
    best = max(shipments, key=lambda s: s["weight"], default=None)
    return best["tracking"] if best else None
