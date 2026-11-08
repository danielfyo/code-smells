# How to run the tests

> SMELL: there is no single command that runs **all** the tests. You have to
> remember several steps, in order, and almost nobody runs the integration
> tests before pushing changes.

1. Unit tests:
   ```
   go test ./...
   ```
2. Integration tests (the previous command does NOT run them!):
   ```
   go test -tags integration ./...
   ```
3. Before step 2, start the test database by hand and export
   `TEST_DB_URL` (ask Luis for the password).
4. To see coverage, repeat everything with `-coverprofile=cover.out` and then
   run `go tool cover -func=cover.out`.
5. Remember to stop the database when you are done.
