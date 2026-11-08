#!/usr/bin/env sh
# REFACTOR: a single entry point for the whole suite; exits non-zero if anything fails.
set -eu
cd "$(dirname "$0")/../../../../.."   # root of the react-ts project
npm test
