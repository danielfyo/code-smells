"""Building a plain-text inventory report."""


# REFACTOR: Replace Concatenation with str.join + f-strings. A list of lines is built with
# f-strings and joined once with `"\n".join(...)`: linear cost, correct separators by
# construction and readable formatting.
def inventory_report(items: dict[str, int]) -> str:
    lines = [f"{name}: {quantity} units" for name, quantity in items.items()]
    lines.append(f"Total: {sum(items.values())} units")
    return "\n".join(lines)


def csv_row(values: list[str]) -> str:
    return ",".join(values)
