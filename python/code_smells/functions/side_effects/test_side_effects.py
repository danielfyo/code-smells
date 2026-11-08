"""Same login result; the pure check no longer alters state."""

from code_smells.functions.side_effects import refactored, smelly

ATTEMPTS = ["bad", "bad", "secret", "bad", "bad", "bad", "secret"]


def test_same_login_sequence() -> None:
    smelly.audit_log.clear()
    users = {"ana": {"password": "secret", "failures": 0, "locked": False}}
    service = refactored.LoginService({"ana": refactored.Account("secret")})
    old = [smelly.check_password(users, "ana", p) for p in ATTEMPTS]
    new = [service.login("ana", p) for p in ATTEMPTS]
    assert old == new == [False, False, True, False, False, False, False]
    assert smelly.audit_log == service.audit_log
    assert users["ana"]["locked"] == service.accounts["ana"].locked is True


def test_smelly_check_mutates_but_query_does_not() -> None:
    users = {"ana": {"password": "secret", "failures": 0, "locked": False}}
    for _ in range(3):
        smelly.check_password(users, "ana", "bad")
    assert users["ana"]["locked"]  # "checking" locked the account!

    account = refactored.Account("secret")
    for _ in range(3):
        account.password_matches("bad")
    assert not account.locked
    assert account.failures == 0
