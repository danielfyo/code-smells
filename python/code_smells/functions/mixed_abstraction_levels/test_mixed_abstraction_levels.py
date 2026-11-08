"""The import produces the same result with separated levels of abstraction."""

from code_smells.functions.mixed_abstraction_levels import refactored, smelly

CSV = """name,email
ana lopez, Ana@Mail.com

luis, bad-email
eva, eva@mail.com
dup, ana@mail.com
old, old@mail.com
"""


def test_same_import() -> None:
    old_db, new_db = {"old@mail.com": "Old"}, {"old@mail.com": "Old"}
    assert smelly.import_customers(CSV, old_db) == refactored.import_customers(CSV, new_db)
    assert old_db == new_db
    assert new_db["ana@mail.com"] == "Ana Lopez"
