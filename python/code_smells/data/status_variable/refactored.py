"""Refactored version: the flow is expressed directly, without flags."""

from typing import Any


def has_room(bin_: dict[str, Any], volume: float) -> bool:
    return not bin_["blocked"] and bin_["capacity"] - bin_["used"] >= volume


def find_free_bin(bins: list[dict[str, Any]], volume: float) -> str | None:
    # REFACTOR: Replace Control Flag with Break/Return. next() returns the first item
    # matching the condition and stops; there are no state variables to maintain.
    return next((b["code"] for b in bins if has_room(b, volume)), None)


def all_bins_ok(bins: list[dict[str, Any]]) -> bool:
    # REFACTOR: the accumulating flag is replaced by all().
    return all(b["used"] <= b["capacity"] for b in bins)
