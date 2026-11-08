"""Smelly version: validating an order returns results by mutating its arguments."""


def validate_order(order: dict, errors: list[str], summary: dict) -> None:
    # SMELL: Output Arguments. `errors` and `summary` are "output" parameters: the
    # function returns nothing and communicates its results by modifying them. In the
    # call validate_order(o, errs, summ) you cannot see what goes in and what comes out.
    if not order.get("customer"):
        errors.append("Missing customer")
    if not order.get("lines"):
        errors.append("The order has no lines")
    summary["lines"] = len(order.get("lines", []))
    summary["units"] = sum(qty for _, qty in order.get("lines", []))
