"""Smelly version: a boolean decides whether a summary or a detailed report is generated."""


def stock_report(stock: dict[str, int], detailed: bool) -> str:
    # SMELL: Flag Argument. The function does two different things depending on
    # `detailed`; in the call stock_report(stock, True) the reader cannot tell what True means.
    if detailed:
        lines = [f"{sku}: {qty}" for sku, qty in sorted(stock.items())]
        lines.append(f"TOTAL: {sum(stock.values())}")
        return "\n".join(lines)
    else:
        return f"{len(stock)} SKUs, {sum(stock.values())} units"
