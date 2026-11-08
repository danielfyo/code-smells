from . import refactored, smelly


def test_same_behavior() -> None:
    old, new = smelly.CustomerService(), refactored.CustomerService()
    for service_add in (old.add_client, new.add_customer):
        service_add(7, "Martha", "HOME-01")
        service_add(3, "Ian", "AUTO-22")
    assert old.fetch_customer(7) == new.get_customer(7)
    assert old.get_user_policy(3) == new.get_customer_policy(3) == "AUTO-22"
    assert old.retrieve_all_clients() == new.get_customer_ids() == [3, 7]
    assert old.load_customer_name(7) == new.get_customer_name(7) == "Martha"
