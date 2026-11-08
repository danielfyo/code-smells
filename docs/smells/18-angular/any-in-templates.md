# $any() and any in Templates

> **ID:** CS198 · **Category:** Angular-specific · **Sources:** angular.dev: strict templates

## Definition

Using the `$any()` cast in templates, or declaring component fields and inputs as `any`, to silence template type
errors. Angular's template type checker then treats the expression as `any`, so wrong property names, wrong input
types and missing null checks compile and fail at runtime.

## Symptoms

- `$any($event.target).value`, `$any(order).customer.name`, `[config]="$any(settings)"` in templates.
- Component fields such as `data: any` or `@Input() item: any` bound throughout the template.
- `strictTemplates` disabled (or individual `strict*` flags turned off) in `tsconfig.json`.
- Runtime errors like `Cannot read properties of undefined` from template expressions.

## Common causes

- Turning on `strictTemplates` in a legacy project and silencing the resulting errors one by one.
- `$event.target` being typed as `EventTarget | null`, not as the concrete element.
- Untyped API responses flowing straight into the view.

## Why it is a problem

- **Template errors move to runtime**: renamed fields and wrong shapes are no longer caught.
- **`any` is contagious**: values bound from an `any` expression into child inputs lose checking there too.
- **False confidence**: the project "builds with strict templates" but the riskiest expressions are exempt.

## How it works under the hood

The Angular compiler translates each template into a **type-check block**: generated TypeScript that mirrors the
template's expressions, bindings and control flow, which the TypeScript compiler then checks. With `strictTemplates`
enabled, inputs are checked against their declared types (including `null` and `undefined`), `$event` is typed per
DOM event or output, local references get their element or directive type, `@if` / `@for` narrow types, and generic
directives infer their context. `$any(expr)` is emitted as a cast to `any` in that block, and an `any`-typed field
behaves the same: every member access and binding downstream is unchecked. The fix is to give the checker real
types: typed fields, template reference variables, typed handlers, and input transforms.

## Example (smelly)

```ts
@Component({
  selector: 'app-qty-picker',
  template: `
    <input type="number" (input)="qty = $any($event.target).value" />  <!-- SMELL -->
    <p>{{ $any(product).nmae }}</p>                                     <!-- SMELL: typo compiles -->
    <app-price [amount]="$any(product).price" />
  `,
  imports: [Price],
})
export class QtyPicker {
  product: any;   // SMELL: untyped field used across the template
  qty = 1;
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-qty-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Price],
  template: `
    <input #qtyInput type="number" (input)="qty.set(qtyInput.valueAsNumber)" /> <!-- REFACTOR -->
    <p>{{ product().name }}</p>                                    <!-- checked by the compiler -->
    <app-price [amount]="product().price" />
  `,
})
export class QtyPicker {
  readonly product = input.required<Product>(); // REFACTOR: real type for the template checker
  readonly qty = signal(1);
}
```

## Recommended refactorings

- **Type component fields and inputs** with domain interfaces; validate external data at the boundary.
- Replace `$any($event.target)` with a **template reference variable** (`#el`) or a typed handler method.
- Use `@if (x; as y)` and optional chaining to handle nullability instead of casting.
- Use input `transform` functions (`booleanAttribute`, `numberAttribute`) for attribute-style inputs.
- Keep `strictTemplates: true` and remove suppressions incrementally.

## When it may be acceptable

- Working around a third-party library with incorrect typings, with a comment and an issue reference.
- A short-lived migration step while enabling `strictTemplates` on a legacy code base.

## Related smells

- [Untyped Forms](./untyped-forms.md)
- [Bypassing the Sanitizer](./sanitizer-bypass.md)
- [any Abuse](../16-react-ts/any-type.md) — the same escape hatch in TypeScript code.
- [Type Assertion (as) Abuse](../16-react-ts/type-assertion-abuse.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)

## Automatic detection

- angular-eslint: `@angular-eslint/template/no-any` flags `$any()` in templates.
- typescript-eslint: `@typescript-eslint/no-explicit-any` for `any`-typed fields and inputs.
- `strictTemplates` in `angularCompilerOptions`, plus extended diagnostics such as `nullishCoalescingNotNullable`
  and `optionalChainNotNullable`, which become meaningful only with real types.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/any-in-templates/`](../../../angular/src/smells/angular_specific/any-in-templates/)

## References

- Angular — *Template type checking*: https://angular.dev/tools/cli/template-typecheck
- Angular — *Extended diagnostics*: https://angular.dev/extended-diagnostics
- Angular — *Inputs* (input transforms): https://angular.dev/guide/components/inputs
- angular-eslint: https://github.com/angular-eslint/angular-eslint
