# REFACTOR: a single entry point to build and clean the package.
PYTHON ?= python3
ROOT := $(abspath ../../../..)
OUT ?= $(CURDIR)/dist

.PHONY: build clean
build:
	cd $(ROOT) && $(PYTHON) -m code_smells.environment.multi_step_build.refactored.build --out $(OUT)

clean:
	rm -rf $(OUT)
