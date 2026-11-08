"""Refactored version: a null object for "no plan" and an exception for "does not exist"."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Plan:
    name: str
    discount: float


# REFACTOR: Introduce Special Case (Null Object). "No plan" is just another plan with
# neutral behaviour; there is no need to ask `if plan is not None` anymore.
NO_PLAN = Plan(name="basic", discount=0.0)


@dataclass(frozen=True)
class Customer:
    name: str
    plan: Plan = NO_PLAN


class CustomerNotFound(LookupError):
    pass


class CustomerRepository:
    def __init__(self) -> None:
        self._customers = {"c1": Customer("Ana", Plan("gold", 0.15)), "c2": Customer("Luis")}

    # REFACTOR: Replace Error Code with Exception. "Does not exist" is an explicit
    # error that cannot be ignored by accident.
    def get(self, customer_id: str) -> Customer:
        try:
            return self._customers[customer_id]
        except KeyError:
            raise CustomerNotFound(customer_id) from None


def discount_for(repo: CustomerRepository, customer_id: str) -> float:
    try:
        return repo.get(customer_id).plan.discount
    except CustomerNotFound:
        return 0.0  # explicit business rule: unknown = no discount


def plan_name(repo: CustomerRepository, customer_id: str) -> str:
    return repo.get(customer_id).plan.name
