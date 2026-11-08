"""Building a plain-text inventory report (smelly version)."""


# SMELL: String Concatenation in Loop. `report += ...` creates a new string on every
# iteration (strings are immutable): the cost is quadratic in the worst case and the code
# mixes separators and formatting by hand, which leads to bugs like the trailing comma.
def inventory_report(items: dict[str, int]) -> str:
    report = ""
    for name, quantity in items.items():
        report += name + ": " + str(quantity) + " units\n"
    report += "Total: " + str(sum(items.values())) + " units"
    return report


def csv_row(values: list[str]) -> str:
    row = ""
    for value in values:
        row += value + ","
    return row[:-1]  # strip the last comma "by hand"
