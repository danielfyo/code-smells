# How to build the project (refactored version)

<!-- REFACTOR: a single command, versioned with the code, that performs the whole build
     reproducibly. The same command works locally and in CI. -->

```bash
npm run check
```

`package.json` chains the steps as npm scripts, so nobody has to remember them:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "npm run typecheck && npm test"
  }
}
```

- The Node version is pinned in `package.json` (`engines`) or `.nvmrc`, not in anyone's memory.
- `npm ci` installs exactly what `package-lock.json` specifies.
- Per-environment configuration comes from environment variables, without copying files by hand.
- Any type error fails the build: there are no errors that "are always there".

If you prefer a script, `build.sh` does the same thing in one step.
