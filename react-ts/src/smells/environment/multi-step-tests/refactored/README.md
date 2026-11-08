# How to run the tests (refactored version)

<!-- REFACTOR: a single command runs the whole suite with a shared configuration declared
     in the repository (vitest.config.ts). The same locally and in CI. -->

```bash
npm test          # the whole suite, once
npm run check     # type-check + the whole suite
```

What used to be manual steps is now versioned configuration:

| Before (manual)                         | Now (in the repository)                                 |
|-----------------------------------------|---------------------------------------------------------|
| `--environment jsdom` by hand           | `environment: "jsdom"` in `vitest.config.ts`            |
| Exporting `TZ`                          | `process.env.TZ` set in the setup file                  |
| Starting a mock server in another shell | In-memory test doubles / MSW in `setupFiles`            |
| Adding up results from several terminals| A single report at the end of `vitest run`              |

`run-tests.sh` offers the same single step for environments without npm scripts.
