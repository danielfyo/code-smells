"""Shows with `python -O` that assert-based validation disappears."""

import subprocess
import sys
from pathlib import Path

import pytest

from . import refactored, smelly

PYTHON_ROOT = Path(__file__).resolve().parents[3]

SCRIPT = """
from code_smells.python_specific.assert_for_validation import {module} as m
balances = {{"anna": 10.0}}
try:
    m.transfer(balances, "anna", "louis", 50.0)
    print("ALLOWED", balances["anna"])
except (AssertionError, ValueError):
    print("REJECTED")
"""


def _run(module: str, *flags: str) -> str:
    result = subprocess.run(
        [sys.executable, *flags, "-c", SCRIPT.format(module=module)],
        cwd=PYTHON_ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout.strip()


@pytest.mark.parametrize("module", [smelly, refactored])
def test_valid_transfer(module) -> None:
    balances = {"anna": 100.0}
    module.transfer(balances, "anna", "louis", 30.0)
    assert balances == {"anna": 70.0, "louis": 30.0}


def test_smelly_validation_vanishes_with_optimize_flag() -> None:
    assert _run("smelly") == "REJECTED"
    assert _run("smelly", "-O") == "ALLOWED -40.0"  # negative balance!


def test_refactored_validation_survives_optimize_flag() -> None:
    assert _run("refactored") == "REJECTED"
    assert _run("refactored", "-O") == "REJECTED"


def test_refactored_rejects_non_positive_amount() -> None:
    with pytest.raises(refactored.TransferError):
        refactored.transfer({"anna": 10.0}, "anna", "louis", 0)
