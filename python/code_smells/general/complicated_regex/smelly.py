"""Validation of plates and booking codes for a car rental company (smelly version)."""

import re


# SMELL: Complicated Regex. A long, cryptic regular expression with no name, no comments and
# no decomposition. Which formats does it accept? Why those letters? Nobody knows without an
# hour of analysis, and changing it is scary.
def parse_booking(text: str) -> tuple[str, str] | None:
    m = re.match(
        r"^\s*(?:RES|BK)-?((?:19|20)\d{2}(?:0[1-9]|1[0-2])\d{4})\s*[/|]\s*(\d{4}\s?[B-DF-HJ-NP-TV-Z]{3})\s*$",
        text,
        re.I,
    )
    if not m:
        return None
    return m.group(1), m.group(2).upper().replace(" ", "")
