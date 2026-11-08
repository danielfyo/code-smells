# How to build the Angular app ("smelly" version)

<!-- SMELL: the build requires more than one step. Producing a deployable bundle depends on a
     manual sequence of commands, hand-edited files and tribal knowledge. Every developer and every
     CI job does it slightly differently, and new joiners lose a day before their first build. -->

1. Install Node **exactly** 22.22 (newer versions "sometimes" break the build, nobody knows why).
2. Install the global CLI: `npm install -g @angular/cli` (whatever version is latest today).
3. Run `npm install` (not `npm ci`, the lock file is "usually" out of date).
4. If `@angular/forms` is missing, install it by hand: `npm install @angular/forms --no-save`.
5. Copy `src/environments/environment.example.ts` to `src/environments/environment.ts` and fill in
   `apiUrl` with the value pinned in the team chat.
6. Type-check first, because `ng build` "does not catch everything":
   `npx tsc -p tsconfig.app.json --noEmit`.
7. Build: `ng build --configuration production`.
8. If the build fails with a budget error, temporarily raise `maximumError` in `angular.json`
   (remember to revert it before committing).
9. Copy `dist/code-smells-angular/browser` to the shared drive and tell ops in the chat.
