"""Smelly version: importing customers mixes business policy with low-level details."""


def import_customers(csv_text: str, existing: dict[str, str]) -> list[str]:
    # SMELL: Mixed Levels of Abstraction. High-level decisions ("import only new,
    # valid customers") live in the same function as low-level details (splitting
    # strings on commas, stripping spaces, checking @ signs by hand).
    imported = []
    for raw in csv_text.splitlines()[1:]:
        if not raw.strip():
            continue
        parts = raw.split(",")
        email = parts[1].strip().lower()
        name = parts[0].strip().title()
        at = email.find("@")
        if at <= 0 or "." not in email[at:]:
            continue
        if email in existing:
            continue
        existing[email] = name
        imported.append(email)
    return imported
