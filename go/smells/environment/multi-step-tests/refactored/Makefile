# REFACTOR: `make test` runs the WHOLE suite (unit + integration, with
# coverage) in one step, the same locally as in CI. Dependencies (e.g.
# starting a test database) would be automated in the test-deps target instead
# of being documented by hand.

.PHONY: test unit integration test-deps

test: test-deps
	go vet -tags integration ./...
	go test -tags integration -cover ./...

unit:
	go test ./...

integration: test-deps
	go test -tags integration -run Integration ./...

test-deps:
	@echo "no external dependencies in this example"
