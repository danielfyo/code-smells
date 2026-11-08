"""Smelly version: warnings and checks are silenced so the import "works"."""

import warnings


class PriceWarning(UserWarning):
    """Warning emitted when an imported price looks suspicious."""


def parse_price(raw: str) -> float:
    price = float(raw.replace(",", "."))
    if price <= 0:
        warnings.warn(f"Non-positive price: {raw}", PriceWarning, stacklevel=2)
    return price


def import_price_list(rows: list[tuple[str, str]]) -> dict[str, float]:
    # SMELL: Overridden Safeties. The warnings were annoying in the console, so ALL
    # of them are disabled globally (affecting the rest of the program) instead of
    # fixing the data. Negative prices get into the catalogue without anyone
    # noticing.
    warnings.filterwarnings("ignore")
    prices = {}
    for sku, raw in rows:
        price = parse_price(raw)
        prices[sku] = price  # type: ignore[assignment]  # SMELL: silences the type checker
    return prices

# SMELL: the repository also had a test marked with
# @pytest.mark.skip(reason="fails with negative prices, check later") for months:
# another safety disabled instead of fixed.
