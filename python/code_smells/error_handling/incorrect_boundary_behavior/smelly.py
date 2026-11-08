"""Smelly version: paginating an invoice list with bugs at the edges."""


def page_count(total_items: int, page_size: int) -> int:
    # SMELL: Incorrect Behavior at the Boundaries. Integer division: with 21 items and
    # pages of 10 it returns 2 and the last invoice is never shown (off-by-one).
    return total_items // page_size


def get_page(invoices: list[str], page: int, page_size: int) -> list[str]:
    # SMELL: pages are 1-based for the user, but the calculation does not fully
    # account for it: page 0 or a negative page returns data instead of an error, and
    # a page_size of 0 is not validated.
    start = (page - 1) * page_size
    return invoices[start:start + page_size]


def is_last_page(total_items: int, page: int, page_size: int) -> bool:
    # SMELL: inherits page_count's off-by-one; with 0 items no page is "the last".
    return page == page_count(total_items, page_size)
