"""Price conversion for an international online shop."""

import os
from functools import cache

from . import fake_db


# REFACTOR: Defer Side Effects (Lazy Initialization). Importing the module does nothing but
# define functions. The connection is opened the first time it is needed (and reused thanks
# to `functools.cache`) and the configuration is read at the moment it is used.
@cache
def get_connection() -> fake_db.Connection:
    return fake_db.connect(os.environ.get("SHOP_DB_DSN", "sqlite:///shop.db"))


def _show_symbol() -> bool:
    return os.environ.get("SHOP_SHOW_SYMBOL", "1") == "1"


def price_in(amount_eur: float, currency: str) -> str:
    converted = round(amount_eur * get_connection().fetch_exchange_rate(currency), 2)
    return f"{converted} {currency}" if _show_symbol() else str(converted)
