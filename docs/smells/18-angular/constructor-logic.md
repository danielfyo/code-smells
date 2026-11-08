# Logic in Constructors

> **ID:** CS186 · **Category:** Angular-specific · **Sources:** angular.dev: lifecycle hooks

## Definition

Component or directive constructors that read inputs, call services, start HTTP requests, subscribe to streams or
touch the DOM, instead of only declaring dependencies and initial state. In Angular the constructor runs **before**
inputs are bound and before the view exists, so the work runs too early, with missing data, and is hard to control
in tests.

## Symptoms

- `constructor() { this.load(this.orderId()); }` or reading a decorator `@Input()` field in the constructor.
- Errors such as NG0950 (*input is required but no value is available yet*) when a required signal input is read
  too early.
- `nativeElement` or `viewChild()` accessed in the constructor and found empty.
- Specs that cannot set inputs or replace providers before the side effect has already happened.

## Common causes

- Habits from other frameworks or languages where the constructor is the initialization point.
- Confusing "injection context" (needed for `inject()`) with "the place to do the work".
- Avoiding lifecycle hooks or reactive primitives out of unfamiliarity.

## Why it is a problem

- **Wrong data**: inputs are `undefined` or throw; the request uses default values.
- **Hidden temporal coupling**: the order of construction, binding and rendering becomes part of the logic.
- **Poor testability**: `TestBed.createComponent()` runs the constructor before `setInput()` can be called.
- **SSR issues**: DOM access in the constructor fails on the server.

## How it works under the hood

When Angular creates a view, it instantiates the component class (resolving `inject()` calls and constructor
parameters from the element and environment injectors), then binds inputs, then calls `ngOnChanges` and `ngOnInit`,
then renders the template. Child views and queries are ready later (`ngAfterViewInit`), and DOM-dependent work belongs
in `afterNextRender()`, which runs only in the browser. Signal inputs are `InputSignal`s whose value is set by the
binding step: reading a required one in the constructor has no value yet. Reactive alternatives avoid the timing
question entirely: a `computed()` or `resource()` derived from an input runs when it is first read and re-runs when the
input changes; `effect()` runs during change detection, after inputs are set.

## Example (smelly)

```ts
@Component({
  selector: 'app-invoice-view',
  template: `<p>{{ invoice?.number }}</p>`,
})
export class InvoiceView {
  readonly invoiceId = input.required<string>();
  private readonly api = inject(InvoiceApi);
  invoice?: Invoice;

  constructor() {
    // SMELL: input not bound yet (throws NG0950); request starts before the test can configure anything
    this.api.get(this.invoiceId()).subscribe(i => (this.invoice = i));
    document.title = 'Invoice'; // SMELL: DOM access during construction
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-invoice-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ invoice()?.number }}</p>`,
})
export class InvoiceView {
  readonly invoiceId = input.required<string>();
  private readonly api = inject(InvoiceApi);
  private readonly title = inject(Title);

  // REFACTOR: derived reactively from the input; runs after binding and re-runs on change
  readonly invoice = toSignal(toObservable(this.invoiceId).pipe(switchMap(id => this.api.get(id))));

  constructor() {
    afterNextRender(() => this.title.setTitle('Invoice')); // REFACTOR: browser-only, after render
  }
}
```

## Recommended refactorings

- **Keep constructors declarative**: `inject()` calls and field initializers only.
- **Derive from inputs** with `computed()`, `toObservable()` + `switchMap`, or a resource.
- Move one-off initialization that needs inputs to `ngOnInit`; DOM work to `afterNextRender()`.
- Use platform services (`Title`, `DOCUMENT`) instead of globals.

## When it may be acceptable

- Registering `effect()`s, `DestroyRef.onDestroy()` callbacks or `takeUntilDestroyed()` subscriptions to sources that
  do not depend on inputs: these require an injection context and are cheap to set up.
- Simple constant initialization.

## Related smells

- [Subscription Leak](./subscription-leak.md)
- [Direct DOM Manipulation](./direct-dom-manipulation.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)
- [Control Freak (Newing Dependencies)](../15-csharp/new-in-constructor.md)
- [Import-time Side Effects](../14-python/import-time-side-effects.md)

## Automatic detection

- Runtime error NG0950 when a required signal input is read before it is set.
- angular-eslint: `@angular-eslint/no-lifecycle-call` (lifecycle hooks called manually, often from constructors)
  and `@angular-eslint/prefer-inject`.
- Code review: constructors containing `subscribe`, HTTP calls or `document` access.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/constructor-logic/`](../../../angular/src/smells/angular_specific/constructor-logic/)

## References

- Angular — *Component lifecycle*: https://angular.dev/guide/components/lifecycle
- Angular — *Inputs*: https://angular.dev/guide/components/inputs
- Angular — *Signals*: https://angular.dev/guide/signals
- angular-eslint: https://github.com/angular-eslint/angular-eslint
