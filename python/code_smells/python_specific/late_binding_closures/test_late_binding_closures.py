from . import refactored, smelly


def test_smelly_all_validators_use_last_limit() -> None:
    validators = smelly.build_validators()
    assert validators["rating"](50)  # bug! it should be rejected (max 5)
    assert not validators["age"](110)  # bug! 110 years is valid (max 120)


def test_refactored_each_validator_keeps_its_limit() -> None:
    validators = refactored.build_validators()
    assert not validators["rating"](50)
    assert validators["rating"](5)
    assert validators["age"](110)
    assert not validators["quantity"](100)
