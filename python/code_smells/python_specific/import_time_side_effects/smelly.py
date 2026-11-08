"""Price conversion for an international online shop (smelly version)."""

import os

from . import fake_db

# SMELL: Import-Time Side Effects. Merely doing `import smelly` reads the environment and
# opens a database connection. Importing the module (for a test, for a CLI's help text, for
# documentation tools to inspect it) has a cost and may fail if the database is down. On top
# of that, the configuration is frozen at import time.
DSN = os.environ.get("SHOP_DB_DSN", "sqlite:///shop.db")
CONNECTION = fake_db.connect(DSN)
print_prices_with_symbol = os.environ.get("SHOP_SHOW_SYMBOL", "1") == "1"


def price_in(amount_eur: float, currency: str) -> str:
    converted = round(amount_eur * CONNECTION.fetch_exchange_rate(currency), 2)
    return f"{converted} {currency}" if print_prices_with_symbol else str(converted)
