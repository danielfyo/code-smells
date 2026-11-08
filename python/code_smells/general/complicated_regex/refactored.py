"""Validation of plates and booking codes for a car rental company."""

import re

# REFACTOR: Decompose Regex + Named Groups + re.VERBOSE. The expression is built from named
# pieces and documented line by line. Named groups replace magic indexes.
YEAR = r"(?:19|20)\d{2}"
MONTH = r"(?:0[1-9]|1[0-2])"
SEQUENCE = r"\d{4}"
# Current Spanish plate: 4 digits + 3 consonants (no vowels, no Q, no N-tilde).
PLATE_LETTERS = r"[B-DF-HJ-NP-TV-Z]{3}"

BOOKING_PATTERN = re.compile(
    rf"""
    ^\s*
    (?:RES|BK)-?                                  # booking prefix, optional hyphen
    (?P<booking>{YEAR}{MONTH}{SEQUENCE})          # YYYYMM + 4-digit sequence number
    \s*[/|]\s*                                    # separator: slash or pipe
    (?P<plate>\d{{4}}\ ?{PLATE_LETTERS})          # plate, optional space
    \s*$
    """,
    re.IGNORECASE | re.VERBOSE,
)


def parse_booking(text: str) -> tuple[str, str] | None:
    match = BOOKING_PATTERN.match(text)
    if match is None:
        return None
    plate = match["plate"].upper().replace(" ", "")
    return match["booking"], plate
