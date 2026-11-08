"""Documents the mutable default argument bug and its fix."""

import importlib

from . import refactored, smelly


def test_smelly_shares_state_between_calls() -> None:
    module = importlib.reload(smelly)  # start from a "clean" default
    assert module.build_order("paella") == ["paella"]
    assert module.build_order("gazpacho") == ["paella", "gazpacho"]  # bug!
    assert module.add_tag(tag="vegan") == {"vegan": 1}
    assert module.add_tag(tag="vegan") == {"vegan": 2}  # bug!


def test_refactored_each_call_is_independent() -> None:
    assert refactored.build_order("paella") == ["paella"]
    assert refactored.build_order("gazpacho") == ["gazpacho"]
    assert refactored.add_tag(tag="vegan") == {"vegan": 1}
    assert refactored.add_tag(tag="vegan") == {"vegan": 1}


def test_refactored_does_not_mutate_caller_list() -> None:
    extras = ["bread"]
    assert refactored.build_order("soup", extras) == ["bread", "soup"]
    assert extras == ["bread"]
