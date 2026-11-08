"""Smelly version: a single method processes the order from start to finish."""


def process_order(order: dict) -> str:
    # SMELL: Long Method. This function validates, computes the subtotal, applies
    # discounts, taxes and shipping, and also formats the receipt. Six responsibilities
    # mixed in one block: none of them can be tested or reused separately.
    if not order.get("items"):
        raise ValueError("The order has no lines")
    for item in order["items"]:
        if item["qty"] <= 0:
            raise ValueError(f"Invalid quantity for {item['sku']}")

    # SMELL: "section" comments betray methods begging to be extracted.
    # --- subtotal ---
    subtotal = 0.0
    for item in order["items"]:
        subtotal += item["price"] * item["qty"]

    # --- discount ---
    discount = 0.0
    if order.get("coupon") == "WELCOME10":
        discount = subtotal * 0.10
    elif subtotal > 200:
        discount = subtotal * 0.05

    # --- taxes ---
    taxable = subtotal - discount
    tax = taxable * 0.21

    # --- shipping ---
    if taxable >= 50:
        shipping = 0.0
    else:
        shipping = 4.95

    total = round(taxable + tax + shipping, 2)

    # --- receipt ---
    lines = [f"Order for {order['customer']}"]
    for item in order["items"]:
        lines.append(f"  {item['qty']} x {item['sku']} @ {item['price']:.2f}")
    lines.append(f"Subtotal: {subtotal:.2f}")
    lines.append(f"Discount: -{discount:.2f}")
    lines.append(f"VAT: {tax:.2f}")
    lines.append(f"Shipping: {shipping:.2f}")
    lines.append(f"Total: {total:.2f}")
    return "\n".join(lines)
