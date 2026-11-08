# Untyped Forms

> **ID:** CS197 · **Category:** Angular-specific · **Sources:** angular.dev: typed reactive forms

## Definition

Reactive forms built with `UntypedFormGroup`, `UntypedFormControl`, `FormGroup<any>` or values cast with `as any`,
so `form.value`, `form.get('...')` and `valueChanges` are typed as `any`. Typos in control names, wrong value types
and missing nulls are only discovered at runtime.

## Symptoms

- `UntypedFormGroup` / `UntypedFormBuilder` imports (often left by the Angular 14 migration).
- `this.form.get('adress')?.value` — a misspelled name that silently returns `undefined`.
- `this.form.value as Booking` or `form.value.guests as number` casts before sending to the API.
- `valueChanges.subscribe((v: any) => ...)`.
- Runtime errors like `Cannot read properties of null` after a control is reset.

## Common causes

- Code written before typed forms existed (Angular 14) and automatically migrated to the `Untyped*` aliases.
- Building forms dynamically from configuration.
- Fighting the `null` that `reset()` introduces instead of using non-nullable controls.

## Why it is a problem

- **No compile-time checking**: renamed fields and wrong types reach production.
- **`any` spreads**: the form value flows into services and DTOs untyped.
- **Refactoring is risky**: renaming a control does not update string lookups.

## How it works under the hood

Typed forms infer the shape from the controls: `new FormGroup({ guests: new FormControl(2) })` has type
`FormGroup<{ guests: FormControl<number | null> }>`. The value type includes `null` because `reset()` sets controls
back to `null` unless they are created with `nonNullable: true` (or through `NonNullableFormBuilder`, available via
`inject(FormBuilder).nonNullable`), in which case reset restores the initial value and the type drops `null`.
`form.value` is a `Partial<...>` because disabled controls are excluded; `getRawValue()` returns the full, required
shape. `form.controls.guests` is a typed property access the compiler checks, unlike string-based `get('guests')`.
The `Untyped*` classes are aliases of the `any`-typed versions, kept only for migration.

## Example (smelly)

```ts
@Component({ selector: 'app-booking-form', imports: [ReactiveFormsModule], templateUrl: './booking-form.html' })
export class BookingForm {
  private readonly fb = inject(UntypedFormBuilder);
  readonly form: UntypedFormGroup = this.fb.group({   // SMELL: everything is any
    guestName: [''],
    guests: [2],
    checkIn: [null],
  });

  submit(): Booking {
    const nights = this.form.get('nigths')?.value;    // SMELL: typo compiles, returns undefined
    return { ...this.form.value, nights } as Booking; // SMELL: cast hides the mismatch
  }
}
```

## Solution (refactored)

```ts
@Component({ selector: 'app-booking-form', imports: [ReactiveFormsModule], templateUrl: './booking-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class BookingForm {
  private readonly fb = inject(NonNullableFormBuilder); // REFACTOR: typed, non-nullable controls
  readonly form = this.fb.group({
    guestName: ['', Validators.required],
    guests: [2, Validators.min(1)],
    nights: [1],
    checkIn: this.fb.control<string | null>(null),      // REFACTOR: nullability is explicit
  });

  submit(): Booking {
    const v = this.form.getRawValue();                  // { guestName: string; guests: number; ... }
    return { guestName: v.guestName, guests: v.guests, nights: v.nights, checkIn: v.checkIn ?? '' };
  }
}
```

## Recommended refactorings

- **Replace `Untyped*` with typed `FormGroup` / `FormControl`**, letting inference produce the type.
- Use `NonNullableFormBuilder` or `nonNullable: true` for controls with a meaningful default.
- Access controls via `form.controls.x` instead of `get('x')`; use `getRawValue()` for the full value.
- Declare an explicit interface for complex forms (`FormGroup<BookingControls>`) and map to the DTO in one function.

## When it may be acceptable

- Truly dynamic forms generated from server-side schemas, where `FormRecord<FormControl<string>>` or a validated
  mapping layer is used instead of `any`.
- Temporarily, during a large migration, with a tracking issue.

## Related smells

- [$any() and any in Templates](./any-in-templates.md)
- [any Abuse](../16-react-ts/any-type.md)
- [Type Assertion (as) Abuse](../16-react-ts/type-assertion-abuse.md)
- [Stringly Typed Code](../16-react-ts/stringly-typed.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)

## Automatic detection

- typescript-eslint: `@typescript-eslint/no-explicit-any`, `no-unsafe-assignment`, `no-unsafe-member-access`.
- ESLint `no-restricted-imports` to forbid `UntypedFormGroup`, `UntypedFormControl` and `UntypedFormBuilder`.
- `strictTemplates` checks `[formControl]` bindings against the control's type.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/untyped-forms/`](../../../angular/src/smells/angular_specific/untyped-forms/)

## References

- Angular — *Typed forms*: https://angular.dev/guide/forms/typed-forms
- Angular — *Reactive forms*: https://angular.dev/guide/forms/reactive-forms
- typescript-eslint rules: https://typescript-eslint.io/rules/
