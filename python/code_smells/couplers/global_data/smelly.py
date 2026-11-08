"""Smelly version: the configuration and the invoice counter are mutable globals."""

# SMELL: Global Data. Any module can read and modify these variables; there is no way
# to know who changed them, nor to have two configurations at once (e.g. two
# companies). Tests contaminate each other unless they are reset by hand.
CONFIG = {"prefix": "INV", "tax_rate": 0.21}
next_invoice_number = 1


def issue_invoice(net: float) -> dict:
    global next_invoice_number
    number = f"{CONFIG['prefix']}-{next_invoice_number:04d}"
    next_invoice_number += 1
    return {"number": number, "total": round(net * (1 + CONFIG["tax_rate"]), 2)}


def switch_to_reduced_vat() -> None:
    # SMELL: action at a distance: it affects every invoice issued afterwards,
    # from anywhere in the program.
    CONFIG["tax_rate"] = 0.10
