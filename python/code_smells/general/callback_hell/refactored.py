"""Checkout process: check stock, charge and ship."""

import asyncio

STOCK = {"SKU-1": 5, "SKU-2": 0}


class CheckoutError(Exception):
    pass


# REFACTOR: Replace Callbacks with async/await. Each step is a coroutine that returns its
# result or raises an exception; the flow reads top to bottom and errors are handled in a
# single try/except.
async def check_stock(sku: str) -> None:
    await asyncio.sleep(0)
    if STOCK.get(sku, 0) <= 0:
        raise CheckoutError("out of stock")


async def charge_card(card: str, amount: float) -> str:
    await asyncio.sleep(0)
    if not card.startswith("4"):
        raise CheckoutError("card declined")
    return f"TX-{round(amount * 100)}"


async def create_shipment(sku: str) -> str:
    await asyncio.sleep(0)
    return f"SHIP-{sku}"


async def checkout(sku: str, card: str, amount: float) -> str:
    try:
        await check_stock(sku)
        transaction = await charge_card(card, amount)
        shipment = await create_shipment(sku)
    except CheckoutError as error:
        return f"error: {error}"
    return f"ok: {transaction} {shipment}"
