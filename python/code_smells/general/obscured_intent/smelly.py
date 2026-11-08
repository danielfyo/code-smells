"""Card number check-digit validation (smelly version)."""


# SMELL: Obscured Intent. A single "clever" expression with slicing, divmod and implicit
# arithmetic. It works (it is the Luhn algorithm) but nobody recognizes it or dares to touch
# it; cryptic names and no hint of the intent.
def ok(n: str) -> bool:
    return not sum(sum(divmod(int(c) * (1 + i % 2), 10)) for i, c in enumerate(n[::-1])) % 10
