"""Customer service of an insurance company (smelly version)."""


# SMELL: Inconsistent Names. The same concept is called "customer", "client" and "user",
# and the same operation "fetch", "get", "retrieve" and "load". The reader wonders whether
# they are different things (is a "client" a special kind of "customer"?) and cannot guess
# the name of the next method.
class CustomerService:
    def __init__(self) -> None:
        self._customers: dict[int, dict[str, str]] = {}

    def add_client(self, client_id: int, name: str, policy: str) -> None:
        self._customers[client_id] = {"name": name, "policy": policy}

    def fetch_customer(self, customer_id: int) -> dict[str, str]:
        return self._customers[customer_id]

    def get_user_policy(self, user_id: int) -> str:
        return self._customers[user_id]["policy"]

    def retrieve_all_clients(self) -> list[int]:
        return sorted(self._customers)

    def load_customer_name(self, cid: int) -> str:
        return self._customers[cid]["name"]
