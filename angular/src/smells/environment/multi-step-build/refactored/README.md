# How to build the Angular app (refactored version)

<!-- REFACTOR: one command builds everything. Every manual step became configuration that lives
     in the repository, so the build is identical on every laptop and in CI. -->

```bash
./build.sh          # from this folder, or from the angular/ root:
npm ci && npm run check && npm run build
```

What used to be tribal knowledge is now versioned:

| Before (manual)                              | Now (in the repository)                                  |
|----------------------------------------------|----------------------------------------------------------|
| "Install Node 22.22 exactly"                 | `engines.node` in `package.json`                         |
| Global, unpinned Angular CLI                 | `@angular/cli` in `devDependencies`, run through `npx`   |
| `npm install` + packages added by hand       | `npm ci` from the committed `package-lock.json`          |
| Copying and editing an environment file      | Typed configuration provided with an `InjectionToken`    |
| Separate type-check step                     | `npm run check` (type-check + tests)                     |
| Raising budgets "temporarily"                | Budgets fixed in `angular.json`, enforced by `ng build`  |
| Copying `dist/` to a shared drive            | CI publishes the artifact from the same command          |

The repository-level `make angular` target runs exactly the same steps as CI.
