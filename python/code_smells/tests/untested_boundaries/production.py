"""Code under test: museum ticket price by age."""


def ticket_price(age: int) -> float:
    """Free up to 5 (inclusive), reduced from 6 to 17 and from 65, standard from 18 to 64."""
    if age < 0:
        raise ValueError("negative age")
    if age <= 5:
        return 0.0
    if age < 18 or age >= 65:
        return 6.0
    return 12.0
