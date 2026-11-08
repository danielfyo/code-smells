"""Date formatting for laundry receipts."""

import json
from datetime import date
from typing import Any


# REFACTOR: Replace Monkey Patch with Explicit Extension. Instead of altering `json.dumps`
# for everyone, a dedicated encoder (a JSONEncoder subclass) is defined and used only where
# needed. The behavior of the rest of the process does not change.
class ReceiptEncoder(json.JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, date):
            return o.isoformat()
        return super().default(o)


def receipt_json(ticket: str, pickup: date, total: float) -> str:
    return json.dumps({"ticket": ticket, "pickup": pickup, "total": total}, cls=ReceiptEncoder)
