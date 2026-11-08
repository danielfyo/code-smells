#!/usr/bin/env sh
# REFACTOR: a single entry point for the whole suite: type-check plus every spec file.
# It exits non-zero if anything fails, so CI and developers run exactly the same thing.
set -eu
cd "$(dirname "$0")/../../../../.."   # root of the angular project
npm run check
