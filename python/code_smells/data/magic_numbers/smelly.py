"""Smelly version: gym fees full of unnamed literals."""


def membership_fee(plan: str, age: int, months: int) -> float:
    # SMELL: Magic Numbers / Magic Strings. What is 29.9? Why 26 and 65? What does
    # "P" mean? Is 0.8 a discount? You have to guess, and if the price changes you
    # have to hunt for the literal throughout the code.
    if plan == "P":
        base = 49.9
    elif plan == "B":
        base = 29.9
    else:
        raise ValueError(plan)
    if age < 26 or age >= 65:
        base *= 0.8
    if months >= 12:
        base *= 0.9
    return round(base * months, 2)
