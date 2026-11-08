"""Summary of the products in a supermarket order (smelly version)."""


# SMELL: Shadowing Builtins. Parameters and variables are called `list`, `id`, `sum`, `type`
# and `max`. Inside the function the builtins can no longer be used (calling `sum()` would
# give "TypeError: 'float' object is not callable") and the reader gets confused.
def order_summary(id: str, list: list[tuple[str, str, float]]) -> str:
    sum = 0.0
    max = ("", 0.0)
    for name, type, price in list:
        sum += price
        if price > max[1]:
            max = (name, price)
    return f"Order {id}: {len(list)} products, {sum:.2f} EUR, most expensive: {max[0]}"
