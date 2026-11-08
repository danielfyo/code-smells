# Shared Module Dumping Ground

> **ID:** CS188 · **Category:** Angular-specific · **Sources:** angular.dev: standalone components

## Definition

A `SharedModule` (or `CommonModule`-like catch-all) that declares, imports and re-exports every pipe, directive,
component and third-party module "that someone might need", and is imported by every feature. Each component's real
dependencies become invisible, and everything depends on everything.

## Symptoms

- An `NgModule` with dozens of entries in `imports`, `declarations` and `exports`.
- Features importing `SharedModule` to use a single pipe.
- Large initial and lazy bundles; tree shaking cannot remove unused UI libraries.
- Circular import problems or "is part of the declarations of 2 modules" errors.
- New developers unable to tell which component uses which dependency.

## Common causes

- NgModule-era advice to "put reusable things in a shared module".
- Convenience: one import instead of many.
- No migration to standalone components after Angular made them the default.

## Why it is a problem

- **Hidden dependencies**: a component's template can use anything the module exports; nothing documents what it
  actually needs.
- **Bundle size**: lazy-loaded features pull in the whole shared module.
- **Coupling and slow change**: touching the shared module affects every feature and its tests.
- **Test setup cost**: specs must import the whole module to render one component.

## How it works under the hood

With NgModules, the compiler builds a **compilation scope** for each declared component: every directive and pipe
exported by any module imported into its declaring module is available to its template. A dumping-ground module
therefore puts all of its exports in scope for all of its consumers, and the bundler has to keep code that is
reachable through the module's metadata. Standalone components declare their own `imports`; the compiler resolves the
template against exactly those, so each component lists its real dependencies, unused ones are reported, and
bundlers can split code per component and per lazy route. Providers that used to live in `forRoot()` modules move to
`provide*()` functions in `app.config.ts` or to `providedIn: 'root'`.

## Example (smelly)

```ts
@NgModule({
  declarations: [MoneyPipe, StatusBadge, ConfirmDialog, AvatarComponent, DateRangePicker],
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatDialogModule, ChartsModule],
  // SMELL: re-exports everything; every feature gets all of it
  exports: [CommonModule, ReactiveFormsModule, MatTableModule, MatDialogModule, ChartsModule,
            MoneyPipe, StatusBadge, ConfirmDialog, AvatarComponent, DateRangePicker],
})
export class SharedModule {}

@Component({
  selector: 'app-invoice-total',
  standalone: false,
  template: `{{ total | money }}`, // only needs MoneyPipe
})
export class InvoiceTotal { total = 0; }
```

## Solution (refactored)

```ts
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {           // REFACTOR: standalone pipe
  transform(value: number): string { return `${value.toFixed(2)} EUR`; }
}

@Component({
  selector: 'app-invoice-total',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe],                                     // REFACTOR: explicit, minimal dependencies
  template: `{{ total() | money }}`,
})
export class InvoiceTotal { readonly total = input(0); }
```

## Recommended refactorings

- **Migrate to standalone** with the official schematic (`ng generate @angular/core:standalone`).
- **Inline the module**: import each pipe, directive or component directly where it is used.
- Group a few things that are *always* used together in an exported array constant if needed.
- Move providers to `provide*()` functions or `providedIn: 'root'`.

## When it may be acceptable

- Legacy applications in the middle of a migration.
- Small, cohesive modules for a library whose pieces are always used together (e.g. a form-field set).

## Related smells

- [Fat Component](./fat-component.md)
- [utils / common Packages](../17-go/utils-package.md) — the same catch-all problem at package level.
- [Artificial Coupling](../05-couplers/artificial-coupling.md)
- [Divergent Change](../03-change-preventers/divergent-change.md)

## Automatic detection

- angular-eslint: `@angular-eslint/prefer-standalone`.
- Angular extended diagnostic `unusedStandaloneImports` reports imports a standalone component does not use.
- Bundle analysis (`ng build --stats-json` with a bundle analyzer, or source-map-explorer) shows shared code in
  every chunk.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/shared-module-dumping-ground/`](../../../angular/src/smells/angular_specific/shared-module-dumping-ground/)

## References

- Angular — *Migrate to standalone*: https://angular.dev/reference/migrations/standalone
- Angular — *NgModules*: https://angular.dev/guide/ngmodules/overview
- Angular — *Extended diagnostics*: https://angular.dev/extended-diagnostics
- angular-eslint: https://github.com/angular-eslint/angular-eslint
