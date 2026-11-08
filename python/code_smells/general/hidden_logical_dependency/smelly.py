"""Reading a fixed-width bank transfer file (smelly version)."""

# Record layout: 10 characters of shortened IBAN + 8 characters of amount in cents.


def build_record(account: str, cents: int) -> str:
    return account.ljust(10)[:10] + str(cents).zfill(8)


def parse_record(record: str) -> tuple[str, int]:
    # SMELL: Hidden Logical Dependency. The parser "knows" the account is 10 wide and the
    # amount 8 because it was copied from `build_record`, but nothing ties them together. If
    # someone widens the field to 12 in one place, the other still runs and silently reads
    # corrupted data.
    return record[0:10].strip(), int(record[10:18])


def total_cents(records: list[str]) -> int:
    # SMELL: another implicit assumption: that every record is exactly 18 characters long.
    return sum(parse_record(r)[1] for r in records if len(r) == 18)
