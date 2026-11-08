import inspect
import typing

from . import refactored, smelly

STOPS = {"bakery": (3, 4), "pharmacy": (6, 8), "newsstand": (1, 0)}


def test_same_route() -> None:
    old = smelly.plan_route((0, 0), STOPS)
    new = refactored.plan_route(
        refactored.Point(0, 0), {k: refactored.Point(*v) for k, v in STOPS.items()}
    )
    assert old == new._asdict() == {"route": ["newsstand", "bakery", "pharmacy"], "km": 10.47}


def test_refactored_public_api_is_fully_annotated() -> None:
    for func in (refactored.distance, refactored.plan_route):
        hints = typing.get_type_hints(func)
        params = inspect.signature(func).parameters
        assert set(params) | {"return"} == set(hints)
        assert typing.Any not in hints.values()


def test_smelly_public_api_lacks_useful_annotations() -> None:
    assert typing.get_type_hints(smelly.distance) == {}
    assert typing.Any in typing.get_type_hints(smelly.plan_route).values()
