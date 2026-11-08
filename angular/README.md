# Code smells in Angular

`smelly` / `refactored` examples of the generic smells plus the **22 Angular, RxJS and signals smells**.
Full index: [INDEX.md](INDEX.md).

```bash
npm ci
npm run check                                                      # typecheck + tests
npm run coverage
npx ng test --watch=false --include='src/smells/angular_specific/**/*.spec.ts'   # one category
```

Every `src/smells/<category>/<slug>/` folder contains `smelly.ts`, `refactored.ts` and `<slug>.spec.ts`
(Vitest + Angular `TestBed`, zoneless). Refactored code uses standalone components with `OnPush`, signals,
`input()` / `output()` and `inject()`. The project compiles with `strictTemplates` and extended diagnostics
as errors, so even the smelly examples are valid, type-checked Angular.
