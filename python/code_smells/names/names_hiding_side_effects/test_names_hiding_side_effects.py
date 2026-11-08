from . import refactored, smelly


def test_smelly_getter_creates_phantom_sessions() -> None:
    registry = smelly.SessionRegistry()
    registry.get_session("curious-admin")  # "I only wanted to look"
    assert registry.active_count() == 1
    assert registry.audit_log == ["login curious-admin"]


def test_refactored_query_has_no_side_effects() -> None:
    registry = refactored.SessionRegistry()
    assert registry.find_session("curious-admin") is None
    assert registry.active_count() == 0
    assert registry.audit_log == []


def test_create_behaves_like_old_getter() -> None:
    old, new = smelly.SessionRegistry(), refactored.SessionRegistry()
    assert old.get_session("anna") == new.get_or_create_session("anna") == 1
    assert old.get_session("anna") == new.get_or_create_session("anna") == 1
    assert old.audit_log == new.audit_log == ["login anna"]
