# REFACTOR: `make test` is the only command to remember (and the one CI uses).
PYTHON ?= python3
ROOT := $(abspath ../../../..)

.PHONY: test
test:
	cd $(ROOT) && $(PYTHON) -m code_smells.environment.multi_step_tests.refactored.tasks
