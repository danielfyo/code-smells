"""The single runner executes all three checks and detects a failure in any of them."""

import shutil
import subprocess
import sys
from pathlib import Path

from .refactored import tasks

PYTHON_ROOT = Path(__file__).resolve().parents[3]


def test_all_sessions_pass() -> None:
    assert tasks.run_all() == {"unit": True, "doctest": True, "data": True}


def test_single_command_exit_code() -> None:
    result = subprocess.run(
        [sys.executable, "-m", "code_smells.environment.multi_step_tests.refactored.tasks"],
        cwd=PYTHON_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0
    assert result.stdout.count("OK") == 3


def test_a_failing_data_check_fails_the_whole_run(tmp_path: Path) -> None:
    # With the manual steps, this failure slipped through whenever someone forgot step 4.
    project = tmp_path / "project"
    shutil.copytree(tasks.PROJECT_DIR, project, ignore=shutil.ignore_patterns("__pycache__"))
    (project / "discounts.json").write_text(
        '{"SUMMER10": 10, "VIP25": 25, "BLACKFRIDAY": 40, "OOPS": 150}', encoding="utf-8"
    )
    results = tasks.run_all(project)
    assert results == {"unit": True, "doctest": True, "data": False}
