# REFACTOR: a single command (`make` or `make build`) does everything that used
# to be seven manual steps. The same thing runs locally and in CI.
#
# The version is computed automatically; it can be forced with `make VERSION=1.2.3`.

PKG     := github.com/danielfyo/code-smells/go/smells/environment/multi-step-build/refactored
VERSION ?= $(shell git describe --tags --always 2>/dev/null || echo dev)
LDFLAGS := -X $(PKG).Version=$(VERSION)

export CGO_ENABLED := 0

.PHONY: all build vet test clean

all: build

build: vet
	go generate ./...
	mkdir -p bin
	go build -ldflags "$(LDFLAGS)" -o bin/shop-api ./cmd/shop-api

vet:
	go vet ./...

test:
	go test ./...

clean:
	rm -rf bin
