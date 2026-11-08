"""Smelly version: approving a leave request in the shape of an arrow."""

from datetime import date


def approve_leave(request: dict, balance: dict[str, int], today: date) -> str:
    # SMELL: Deep Nesting / Arrow Code. Five levels of nested ifs; the happy path
    # ("APPROVED") is buried at the bottom and each else is miles away from its if.
    if request is not None:
        if request["start"] > today:
            if request["end"] >= request["start"]:
                days = (request["end"] - request["start"]).days + 1
                if request["employee"] in balance:
                    if balance[request["employee"]] >= days:
                        balance[request["employee"]] -= days
                        return "APPROVED"
                    else:
                        return "REJECTED: insufficient balance"
                else:
                    return "REJECTED: unknown employee"
            else:
                return "REJECTED: invalid dates"
        else:
            return "REJECTED: the date must be in the future"
    else:
        return "REJECTED: empty request"
