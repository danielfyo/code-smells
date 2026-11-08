"""Same in the middle case; documents the smelly version's failures at the edges."""

import pytest

from code_smells.error_handling.incorrect_boundary_behavior import refactored, smelly

INVOICES = [f"F-{i:02d}" for i in range(1, 22)]  # 21 invoices


def test_same_in_the_middle() -> None:
    for page in (1, 2):
        assert smelly.get_page(INVOICES, page, 10) == refactored.get_page(INVOICES, page, 10)
    assert smelly.page_count(20, 10) == refactored.page_count(20, 10) == 2


def test_smelly_boundary_bugs() -> None:
    assert smelly.page_count(21, 10) == 2  # page 3 with "F-21" is missing
    assert not smelly.is_last_page(21, 3, 10)
    assert smelly.get_page(INVOICES, 0, 10) == []  # page 0 accepted without error
    # Page -1: the negative slice returns invoices "from the end" without any error.
    assert smelly.get_page(INVOICES, -1, 10) == INVOICES[1:11]
    with pytest.raises(ZeroDivisionError):
        smelly.page_count(5, 0)


def test_refactored_boundaries() -> None:
    assert refactored.page_count(21, 10) == 3
    assert refactored.get_page(INVOICES, 3, 10) == ["F-21"]
    assert refactored.is_last_page(21, 3, 10)
    assert refactored.page_count(0, 10) == 1
    assert refactored.is_last_page(0, 1, 10)
    for bad_page in (0, -1, 4):
        with pytest.raises(IndexError):
            refactored.get_page(INVOICES, bad_page, 10)
    with pytest.raises(ValueError):
        refactored.page_count(5, 0)
