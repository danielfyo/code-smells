"""Smelly version: None is returned and checked at every step."""


class CustomerRepository:
    def __init__(self) -> None:
        self._customers = {"c1": {"name": "Ana", "plan": {"name": "gold", "discount": 0.15}},
                           "c2": {"name": "Luis", "plan": None}}

    def find(self, customer_id: str) -> dict | None:
        # SMELL: Null Abuse. None means "does not exist" and gets mixed up with
        # "has no plan"; every client of the repository must remember to check it.
        return self._customers.get(customer_id)


def discount_for(repo: CustomerRepository, customer_id: str) -> float:
    # SMELL: a pyramid of None checks that hides the business rule.
    customer = repo.find(customer_id)
    if customer is not None:
        plan = customer.get("plan")
        if plan is not None:
            discount = plan.get("discount")
            if discount is not None:
                return discount
    return 0.0


def plan_name(repo: CustomerRepository, customer_id: str) -> str | None:
    # SMELL: returns None for "unknown customer": the caller may forget to
    # check it and display "None" on screen.
    customer = repo.find(customer_id)
    if customer is None:
        return None
    return customer["plan"]["name"] if customer["plan"] is not None else "basic"
