"""Reading a fixed-width bank transfer file."""

# REFACTOR: Make Dependency Explicit. The widths are defined once, and both the builder and
# the parser (and the length check) are derived from them. A record with the wrong length
# raises an explicit error instead of being ignored.
ACCOUNT_WIDTH = 10
AMOUNT_WIDTH = 8
RECORD_WIDTH = ACCOUNT_WIDTH + AMOUNT_WIDTH


def build_record(account: str, cents: int) -> str:
    return account.ljust(ACCOUNT_WIDTH)[:ACCOUNT_WIDTH] + str(cents).zfill(AMOUNT_WIDTH)


def parse_record(record: str) -> tuple[str, int]:
    if len(record) != RECORD_WIDTH:
        raise ValueError(f"Record has {len(record)} characters; expected {RECORD_WIDTH}")
    return record[:ACCOUNT_WIDTH].strip(), int(record[ACCOUNT_WIDTH:])


def total_cents(records: list[str]) -> int:
    return sum(parse_record(r)[1] for r in records)
