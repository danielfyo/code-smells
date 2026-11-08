# How to run the tests (refactored version)

<!-- REFACTOR: one command runs the whole suite with configuration declared in the repository
     (angular.json "test" target + tsconfig.spec.json). Same locally and in CI. -->

```bash
./run-tests.sh      # from this folder, or from the angular/ root:
npm run check       # type-check + every *.spec.ts, once
npm run coverage    # the same, with a coverage report
```

What used to be manual steps is now versioned configuration:

| Before (manual)                             | Now (in the repository)                                        |
|---------------------------------------------|----------------------------------------------------------------|
| Separate `--include` per kind of spec       | The unit-test builder discovers every `src/**/*.spec.ts`       |
| A legacy Vitest config for pipes            | One `test` target in `angular.json`                            |
| Exporting `TZ` by hand                      | Tests pass explicit dates/locales instead of relying on the OS |
| Starting a fake backend in another terminal | `provideHttpClientTesting()` + `HttpTestingController`         |
| Skipping the slow folder                    | Slow tests rewritten with test doubles, so they run every time |
| Type-checking specs separately              | `npm run typecheck`, chained by `npm run check`                |
| Adding up results from several terminals    | A single Vitest report at the end of the run                   |
