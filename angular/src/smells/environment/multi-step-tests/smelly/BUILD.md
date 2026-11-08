# How to run the tests ("smelly" version)

<!-- SMELL: tests require more than one step. There is no single command for the whole suite:
     each group is launched separately, with its own flags and in a specific order. In practice
     everyone runs only "their own" tests and the rest rot unnoticed. -->

1. Unit tests for services: `npx ng test --watch=false --include='src/**/*.service.spec.ts'`.
2. Component tests: first export `TZ=Europe/Madrid`, then
   `npx ng test --watch=false --include='src/**/*.component.spec.ts'`.
3. Pipe tests are not picked up by the builder: run `npx vitest run src/pipes` with the old config
   in `vitest.legacy.config.ts`.
4. HTTP tests: start the fake backend with `node scripts/fake-api.js` in another terminal and wait
   until it prints "listening on 3000".
5. The `slow` folder is excluded on purpose; run it manually before a release (if you remember).
6. Type-check the spec files separately: `npx tsc -p tsconfig.spec.json --noEmit`.
7. Add up the results of every terminal by hand to know whether everything passed.
