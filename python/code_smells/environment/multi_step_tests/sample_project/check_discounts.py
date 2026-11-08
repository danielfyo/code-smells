"""Data check: every discount is between 1 and 90 %."""

import json
import sys
from pathlib import Path

discounts = json.loads((Path(__file__).parent / "discounts.json").read_text(encoding="utf-8"))
invalid = {code: pct for code, pct in discounts.items() if not 1 <= pct <= 90}
if invalid:
    print(f"Discounts out of range: {invalid}")
    sys.exit(1)
print(f"{len(discounts)} valid discounts")
