# Code smells in React + TypeScript

`Smelly` / `Refactored` examples of the generic smells plus the **22 React and TypeScript smells**.
Full index: [INDEX.md](INDEX.md).

```bash
npm ci
npm run check                                   # tsc --noEmit + vitest run
npx vitest run src/smells/react_ts_specific     # one category
```

Every `src/smells/<category>/<slug>/` folder contains `Smelly.tsx` (or `.ts`), `Refactored.tsx` (or `.ts`)
and `<slug>.test.tsx` using Vitest + Testing Library. TypeScript runs in `strict` mode.
