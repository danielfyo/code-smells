#!/usr/bin/env sh
# REFACTOR: a single, versioned entry point for the whole build. It installs the exact locked
# dependencies, type-checks, runs the tests and produces the production bundle, failing fast.
set -eu
cd "$(dirname "$0")/../../../../.."   # root of the angular project
npm ci
npm run check
npm run build
