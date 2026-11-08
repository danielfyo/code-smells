# Code smells in Go

`smelly` / `refactored` examples of the generic smells (adapted to Go: composition, small interfaces,
explicit errors) plus the **22 idiomatic Go smells**. Full index: [INDEX.md](INDEX.md).

```bash
go vet ./...
go test ./...
go test ./smells/go_specific/... -v      # one category
go test -race ./smells/go_specific/...   # with the race detector
```

Every `smells/<category>/<slug>/` folder contains two packages, `smelly` and `refactored`, each with
its code and its `_test.go`.
