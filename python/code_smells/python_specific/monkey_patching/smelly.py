"""Date formatting for laundry receipts (smelly version)."""

import json
from datetime import date

# SMELL: Monkey Patching in production code. Importing this module changes `json.dumps`
# globally so that it accepts dates. It affects the WHOLE process, including third-party
# libraries that do not expect that behavior, depends on import order and is very hard to
# trace when something goes wrong.
_original_dumps = json.dumps


def _dumps_with_dates(obj, **kwargs):  # type: ignore[no-untyped-def]
    kwargs.setdefault("default", lambda o: o.isoformat() if isinstance(o, date) else str(o))
    return _original_dumps(obj, **kwargs)


json.dumps = _dumps_with_dates


def receipt_json(ticket: str, pickup: date, total: float) -> str:
    return json.dumps({"ticket": ticket, "pickup": pickup, "total": total})


def unpatch() -> None:
    """Tests only: undo the global patch."""
    json.dumps = _original_dumps
