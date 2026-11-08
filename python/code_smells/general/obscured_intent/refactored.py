"""Card number check-digit validation."""


# REFACTOR: Rename + Extract Function + Introduce Explaining Variable. The algorithm (Luhn)
# is named and every step is explicit: walk right to left, double every second digit and
# subtract 9 when the doubled value exceeds 9.
def is_valid_card_number(card_number: str) -> bool:
    """Check the check digit with the Luhn algorithm."""
    return _luhn_checksum(card_number) % 10 == 0


def _luhn_checksum(card_number: str) -> int:
    total = 0
    for position, char in enumerate(reversed(card_number)):
        digit = int(char)
        is_every_second_digit = position % 2 == 1
        if is_every_second_digit:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit
    return total
