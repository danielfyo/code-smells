"""Refactored version: warnings are listened to and invalid data is rejected."""

from dataclasses import dataclass


class InvalidPrice(ValueError):
    pass


@dataclass(frozen=True)
class ImportResult:
    prices: dict[str, float]
    rejected: dict[str, str]


def parse_price(raw: str) -> float:
    # REFACTOR: the warning that used to be silenced becomes a domain error: the
    # problem is handled at its source instead of hiding the symptom.
    price = float(raw.replace(",", "."))
    if price <= 0:
        raise InvalidPrice(f"Non-positive price: {raw}")
    return price


def import_price_list(rows: list[tuple[str, str]]) -> ImportResult:
    # REFACTOR: no global filters and no `type: ignore`; bad rows are reported
    # explicitly to the caller so it can decide what to do with them.
    prices: dict[str, float] = {}
    rejected: dict[str, str] = {}
    for sku, raw in rows:
        try:
            prices[sku] = parse_price(raw)
        except InvalidPrice as exc:
            rejected[sku] = str(exc)
    return ImportResult(prices, rejected)
