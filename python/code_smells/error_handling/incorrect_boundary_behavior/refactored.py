"""Refactored version: boundaries are handled explicitly and in a single place."""

import math
from dataclasses import dataclass


@dataclass(frozen=True)
class Pagination:
    total_items: int
    page_size: int

    def __post_init__(self) -> None:
        # REFACTOR: Introduce Assertion / validate at the boundary. A size of 0 or
        # negative totals are rejected on construction.
        if self.page_size <= 0 or self.total_items < 0:
            raise ValueError("Invalid pagination")

    @property
    def page_count(self) -> int:
        # REFACTOR: round up; an empty listing has 1 (empty) page.
        return max(1, math.ceil(self.total_items / self.page_size))

    def check(self, page: int) -> None:
        if not 1 <= page <= self.page_count:
            raise IndexError(f"Page out of range: {page}")

    def bounds(self, page: int) -> slice:
        self.check(page)
        start = (page - 1) * self.page_size
        return slice(start, start + self.page_size)

    def is_last(self, page: int) -> bool:
        self.check(page)
        return page == self.page_count


def page_count(total_items: int, page_size: int) -> int:
    return Pagination(total_items, page_size).page_count


def get_page(invoices: list[str], page: int, page_size: int) -> list[str]:
    return invoices[Pagination(len(invoices), page_size).bounds(page)]


def is_last_page(total_items: int, page: int, page_size: int) -> bool:
    return Pagination(total_items, page_size).is_last(page)
