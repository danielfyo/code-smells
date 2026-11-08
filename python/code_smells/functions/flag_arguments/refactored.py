"""Refactored version: one function with its own name for each behaviour."""


# REFACTOR: Remove Flag Argument (Split Function). Each branch of the boolean becomes
# an explicit function; the calls read by themselves.
def summary_stock_report(stock: dict[str, int]) -> str:
    return f"{len(stock)} SKUs, {sum(stock.values())} units"


def detailed_stock_report(stock: dict[str, int]) -> str:
    lines = [f"{sku}: {qty}" for sku, qty in sorted(stock.items())]
    lines.append(f"TOTAL: {sum(stock.values())}")
    return "\n".join(lines)
