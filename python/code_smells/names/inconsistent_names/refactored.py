"""Customer service of an insurance company."""


# REFACTOR: Rename to unify the vocabulary: one concept, one word ("customer"), and one
# operation, one verb ("get"). Names become predictable.
class CustomerService:
    def __init__(self) -> None:
        self._customers: dict[int, dict[str, str]] = {}

    def add_customer(self, customer_id: int, name: str, policy: str) -> None:
        self._customers[customer_id] = {"name": name, "policy": policy}

    def get_customer(self, customer_id: int) -> dict[str, str]:
        return self._customers[customer_id]

    def get_customer_policy(self, customer_id: int) -> str:
        return self._customers[customer_id]["policy"]

    def get_customer_ids(self) -> list[int]:
        return sorted(self._customers)

    def get_customer_name(self, customer_id: int) -> str:
        return self._customers[customer_id]["name"]
