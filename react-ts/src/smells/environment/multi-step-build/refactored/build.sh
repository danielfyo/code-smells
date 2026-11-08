#!/usr/bin/env sh
# REFACTOR: a single build script. It stops at the first error (set -eu), is idempotent
# and is exactly what the CI pipeline runs.
set -eu
cd "$(dirname "$0")/../../../../.."   # root of the react-ts project
npm ci
npm run check
