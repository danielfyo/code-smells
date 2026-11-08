"""Refactored version: the main function speaks only in business terms."""

from collections.abc import Iterator
from dataclasses import dataclass


@dataclass(frozen=True)
class CustomerRow:
    name: str
    email: str


def import_customers(csv_text: str, existing: dict[str, str]) -> list[str]:
    # REFACTOR: Extract Function until each function has a single level of
    # abstraction (Compose Method / "Stepdown" rule). Only policy lives here.
    imported = []
    for row in parse_rows(csv_text):
        if is_valid_email(row.email) and row.email not in existing:
            existing[row.email] = row.name
            imported.append(row.email)
    return imported


# --- Low-level details, below and separated ---

def parse_rows(csv_text: str) -> Iterator[CustomerRow]:
    for raw in csv_text.splitlines()[1:]:
        if raw.strip():
            name, email, *_ = raw.split(",")
            yield CustomerRow(name.strip().title(), email.strip().lower())


def is_valid_email(email: str) -> bool:
    at = email.find("@")
    return at > 0 and "." in email[at:]
