# One command to verify everything (Clean Code E1/E2). Mirrors .github/workflows/ci.yml.
.PHONY: all catalog python csharp react-ts go setup-repo

all: catalog python csharp react-ts go

catalog:
	python3 tools/build_catalog.py
	git diff --exit-code -- catalog.json docs/CATALOG.md '*/INDEX.md'
	python3 tools/check_catalog.py --strict
	python3 tools/check_links.py

python:
	cd python && ruff check . && ruff format --check . && python3 -m mypy && python3 -m pytest --cov

csharp:
	dotnet restore CodeSmells.sln --locked-mode
	dotnet build CodeSmells.sln --no-restore
	dotnet test CodeSmells.sln --no-build

react-ts:
	cd react-ts && npm ci && npm audit --audit-level=moderate && npm run typecheck && npm run coverage

go:
	cd go && test -z "$$(gofmt -l .)" && go vet ./... && go test -race ./...

# Applies GitHub repository settings (rulesets, security features, topics). Requires admin rights.
# On Windows use: .\scripts\setup-repo.ps1
setup-repo:
	bash scripts/setup-repo.sh
