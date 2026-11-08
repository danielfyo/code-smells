"""Sales report by region."""


# REFACTOR: Rename Variable. Descriptive names proportional to their scope
# (`totals_by_region`, `grand_total`, `best_region`); short names only survive inside
# one-line expressions. Also Extract Function for the per-region breakdown.
def sales_report(rows: list[tuple[str, str, float]]) -> list[str]:
    totals_by_region: dict[str, float] = {}
    for _seller, region, amount in rows:
        totals_by_region[region] = totals_by_region.get(region, 0.0) + amount

    grand_total = sum(totals_by_region.values())
    best_region = max(totals_by_region, key=totals_by_region.__getitem__, default="")

    lines = [
        _region_line(region, totals_by_region[region], grand_total)
        for region in sorted(totals_by_region)
    ]
    lines.append(f"TOTAL: {grand_total:.2f}")
    lines.append(f"BEST: {best_region}")
    return lines


def _region_line(region: str, region_total: float, grand_total: float) -> str:
    share = region_total / grand_total * 100 if grand_total else 0.0
    return f"{region}: {region_total:.2f} ({share:.1f}%)"
