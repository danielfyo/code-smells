#!/usr/bin/env bash
# REFACTOR: a single command builds the whole solution, the same way locally and in CI.
#           - set -euo pipefail: stop at the first error (no half-finished steps).
#           - dotnet build works out the order between projects from their references.
#           - everything needed to build is versioned in the repository (CodeSmells.sln, global.json).
set -euo pipefail

CONFIGURATION="${1:-Debug}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || (cd "$SCRIPT_DIR/../../../../../.." && pwd))"

cd "$REPO_ROOT"
dotnet build CodeSmells.sln --configuration "$CONFIGURATION"
