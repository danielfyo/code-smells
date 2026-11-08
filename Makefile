# One command to verify everything (Clean Code E1/E2).
.PHONY: all catalog python csharp react-ts go

all: catalog python csharp react-ts go

catalog:
	python3 tools/build_catalog.py
	python3 tools/check_catalog.py --strict

python:
	cd python && python3 -m pytest

csharp:
	dotnet test CodeSmells.sln

react-ts:
	cd react-ts && npm ci && npm run check

go:
	cd go && go vet ./... && go test ./...
