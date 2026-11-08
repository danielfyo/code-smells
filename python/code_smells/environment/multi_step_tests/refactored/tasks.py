"""Run ALL `sample_project` checks with a single command.

Usage:  python3 -m code_smells.environment.multi_step_tests.refactored.tasks
        (or simply `make test` from this folder)
"""

# REFACTOR: Single Test Command (nox/invoke style). Each kind of check is a "session"
# declared in a list; the runner executes them all from the right directory with the same
# interpreter, prints a summary and returns a non-zero exit code if any of them fails.
# Adding a new check means adding one line.

import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent / "sample_project"


@dataclass(frozen=True)
class Session:
    name: str
    args: tuple[str, ...]


SESSIONS = (
    Session("unit", ("-m", "unittest", "-q", "pricing_unit")),
    Session("doctest", ("-m", "doctest", "pricing.py")),
    Session("data", ("check_discounts.py",)),
)


def run_session(session: Session, project_dir: Path = PROJECT_DIR) -> bool:
    result = subprocess.run(
        [sys.executable, *session.args],
        cwd=project_dir,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        print(f"--- {session.name} ---\n{result.stdout}{result.stderr}")
    return result.returncode == 0


def run_all(project_dir: Path = PROJECT_DIR) -> dict[str, bool]:
    return {session.name: run_session(session, project_dir) for session in SESSIONS}


def main() -> int:
    results = run_all()
    for name, ok in results.items():
        print(f"{'OK  ' if ok else 'FAIL'} {name}")
    return 0 if all(results.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
