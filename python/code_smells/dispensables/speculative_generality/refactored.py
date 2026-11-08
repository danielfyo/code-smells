"""Refactored version: only what is needed today (YAGNI)."""

from typing import Any


# REFACTOR: Collapse Hierarchy + Remove Parameter + Inline Function. The abstract
# factory, the base class, the empty hooks and the options dictionary are removed.
# If a second format shows up tomorrow, the abstraction is extracted with real data.
def export_invoices(invoices: list[dict[str, Any]]) -> str:
    lines = ["number;total"]
    lines += [f"{i['number']};{i['total']:.2f}" for i in invoices]
    return "\n".join(lines)
