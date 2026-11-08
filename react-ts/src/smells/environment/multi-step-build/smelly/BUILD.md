# How to build the project ("smelly" version)

<!-- SMELL: multi-step build. Building requires following a long, fragile recipe by hand,
     full of tribal knowledge. Every developer runs it slightly differently, steps get
     forgotten and the result is neither reproducible nor automatable in CI. -->

1. Make sure you have Node 22 (ask Luke which exact version he uses).
2. Delete `node_modules` by hand if "something feels off".
3. Run `npm install`. If it fails, try again with `--legacy-peer-deps`.
4. Copy `src/config.example.ts` to `src/config.ts` and change the API URL to the staging one.
5. Run `npx tsc --noEmit` and eyeball the output for **important** errors.
6. If there are errors in `src/legacy`, ignore them (there always are).
7. Run `npx vite build`.
8. Copy the `dist/` folder to `deploy/www/` and rename `index.html` to `app.html`.
9. Open `deploy/www/app.html` in the browser to check that it loads.

> If something fails, ask in the #frontend channel: someone will know which step is missing.
