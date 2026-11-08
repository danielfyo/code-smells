#!/usr/bin/env bash
# REFACTOR: a single command runs ALL the tests in the solution, the same way locally and in CI.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || (cd "$SCRIPT_DIR/../../../../../.." && pwd))"
cd "$REPO_ROOT"

if [[ "${1:-}" == "--coverage" ]]; then
  dotnet test CodeSmells.sln --collect:"XPlat Code Coverage"
else
  dotnet test CodeSmells.sln
fi
