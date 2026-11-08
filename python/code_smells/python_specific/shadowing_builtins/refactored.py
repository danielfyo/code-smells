"""Summary of the products in a supermarket order."""


# REFACTOR: Rename Variable so builtins are not shadowed (`order_id`, `items`, `category`...).
# With `sum` and `max` back, they can be used directly and the code gets simpler.
def order_summary(order_id: str, items: list[tuple[str, str, float]]) -> str:
    total = sum(price for _name, _category, price in items)
    most_expensive = max(items, key=lambda item: item[2], default=("", "", 0.0))[0]
    return (
        f"Order {order_id}: {len(items)} products, {total:.2f} EUR, "
        f"most expensive: {most_expensive}"
    )
