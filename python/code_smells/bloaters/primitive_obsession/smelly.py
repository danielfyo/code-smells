"""Smelly version: money, currency and email are plain floats and strs."""


def register_payment(email: str, amount: float, currency: str) -> dict:
    # SMELL: Primitive Obsession. The email is just any str and the validation is
    # repeated (or forgotten) in every function that receives it.
    if "@" not in email or email.startswith("@"):
        raise ValueError("Invalid email")
    # SMELL: money is a loose float plus a currency str travelling separately;
    # nothing stops you from adding euros to dollars or dragging floating-point errors.
    if amount < 0:
        raise ValueError("Negative amount")
    return {"email": email.lower(), "amount": round(amount, 2), "currency": currency.upper()}


def total(payments: list[dict]) -> tuple[float, str]:
    # SMELL: you must remember to check the currency by hand in every operation.
    currency = payments[0]["currency"]
    result = 0.0
    for p in payments:
        if p["currency"] != currency:
            raise ValueError("Different currencies")
        result += p["amount"]
    return round(result, 2), currency
