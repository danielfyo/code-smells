"""Refactored version: guard clauses and a flat main path."""

from datetime import date


def approve_leave(request: dict | None, balance: dict[str, int], today: date) -> str:
    # REFACTOR: Replace Nested Conditional with Guard Clauses. Each error case exits
    # as soon as it is detected; the happy path stays at the end, without indentation.
    if request is None:
        return "REJECTED: empty request"
    if request["start"] <= today:
        return "REJECTED: the date must be in the future"
    if request["end"] < request["start"]:
        return "REJECTED: invalid dates"
    employee = request["employee"]
    if employee not in balance:
        return "REJECTED: unknown employee"
    days = (request["end"] - request["start"]).days + 1
    if balance[employee] < days:
        return "REJECTED: insufficient balance"

    balance[employee] -= days
    return "APPROVED"
