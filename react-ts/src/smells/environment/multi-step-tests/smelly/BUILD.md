# How to run the tests ("smelly" version)

<!-- SMELL: multi-step tests. There is no single command that runs the whole suite: each
     group must be launched separately, with different flags and in a specific order. In
     practice everyone runs only "their own" tests and the rest break unnoticed. -->

1. Utility tests: `npx vitest run src/utils`.
2. Component tests: first export `TZ=Europe/Madrid`, then
   `npx vitest run src/components --environment jsdom`.
3. Hook tests: same as components, but **not** in parallel:
   `npx vitest run src/hooks --no-file-parallelism`.
4. Integration tests: first start the API mock with `node scripts/mock-server.js`
   in another terminal and wait until it prints "ready".
5. "Slow" tests: they live in `src/slow` and are only run on Fridays.
6. Check the results in every terminal and add them up by hand to know whether everything passed.
