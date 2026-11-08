# Component Inheritance Hierarchies

> **ID:** CS196 · **Category:** Angular-specific · **Sources:** angular.dev: composition with inject()

## Definition

Sharing behaviour between components through base classes — `BaseListComponent`, `BaseFormComponent`,
`BaseDestroyComponent` — that subclasses `extends`, instead of composing small services, functions that use
`inject()`, and host directives. The hierarchy couples unrelated screens and hides what each component really does.

## Symptoms

- `export class OrdersList extends BaseListComponent<Order>` with abstract members to fill in.
- `super(http, router, dialog, ...)` constructors forwarding many dependencies.
- Subclasses that must remember to call `super.ngOnInit()` / `super.ngOnDestroy()`.
- Base classes full of flags (`showPaging`, `hasDialog`) that only some subclasses use.
- Changes in the base class breaking screens that nobody touched.

## Common causes

- Object-oriented reuse habits from backend code.
- The old pattern of a base class holding a `destroy$` subject for unsubscribing.
- Avoiding duplication quickly without designing the shared pieces.

## Why it is a problem

- **Fragile base class**: every change to the parent can break any child.
- **Refused bequest**: children inherit inputs, host bindings and dependencies they do not need.
- **Hidden lifecycle coupling**: forgetting a `super` call silently disables behaviour.
- **One axis of reuse only**: a component cannot extend two base classes, so behaviours get crammed into one.

## How it works under the hood

Angular copies decorator metadata along the class chain: a subclass inherits the base's inputs, outputs, host
bindings, queries and lifecycle hooks (an overridden hook replaces the parent's unless it calls `super`). With
constructor injection, the subclass must re-declare and forward every dependency to `super(...)`. `inject()` removes
that parameter-forwarding problem, and also enables plain **composition**: any function called in an injection
context can call `inject()`, so behaviour can live in reusable functions (`injectPagination()`), services provided at
the component level, or directives attached through `hostDirectives`, each owning its own state and cleanup via
`DestroyRef`. The component then lists exactly the behaviours it uses.

## Example (smelly)

```ts
@Directive()
export abstract class BaseListComponent<T> implements OnInit, OnDestroy {
  protected readonly destroy$ = new Subject<void>();
  page = 1;
  items: T[] = [];
  constructor(protected http: HttpClient, protected router: Router) {}
  abstract endpoint(): string;
  ngOnInit(): void {
    this.http.get<T[]>(`${this.endpoint()}?page=${this.page}`)
      .pipe(takeUntil(this.destroy$)).subscribe(i => (this.items = i));
  }
  ngOnDestroy(): void { this.destroy$.next(); }
}

@Component({ selector: 'app-orders-list', template: `...` })
export class OrdersList extends BaseListComponent<Order> { // SMELL: reuse through inheritance
  constructor(http: HttpClient, router: Router) { super(http, router); }
  endpoint(): string { return '/api/orders'; }
}
```

## Solution (refactored)

```ts
// REFACTOR: reusable behaviour as a function that composes with inject()
export function injectPagedList<T>(load: (page: number) => Observable<T[]>) {
  const page = signal(1);
  const items = toSignal(toObservable(page).pipe(switchMap(load)), { initialValue: [] as T[] });
  return { page, items, next: () => page.update(p => p + 1) };
}

@Component({
  selector: 'app-orders-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (o of list.items(); track o.id) { <li>{{ o.ref }}</li> }
             <button (click)="list.next()">Next</button>`,
})
export class OrdersList {
  private readonly api = inject(OrderApi);
  protected readonly list = injectPagedList(page => this.api.page(page)); // REFACTOR: composition
}
```

## Recommended refactorings

- **Replace Inheritance with Delegation**: move shared logic into services or `inject*()` functions.
- **Use host directives** (`hostDirectives`) to attach reusable behaviours (tooltips, focus, tracking) to components.
- Replace `destroy$` base classes with `takeUntilDestroyed()` / `DestroyRef`.
- Extract shared markup into child components instead of shared templates.

## When it may be acceptable

- Small abstract directives that only declare common inputs for a family of very similar components (e.g. form
  control wrappers), with no lifecycle logic.
- Library code where a documented base class is part of the public extension contract.

## Related smells

- [Fat Component](./fat-component.md)
- [Subscription Leak](./subscription-leak.md)
- [Refused Bequest](../02-oo-abusers/refused-bequest.md)
- [Base Class Depending on Its Derivatives](../02-oo-abusers/base-class-depends-on-subclass.md)
- [Parallel Inheritance Hierarchies](../03-change-preventers/parallel-inheritance-hierarchies.md)

## Automatic detection

- ESLint `no-restricted-syntax` with a selector for classes decorated with `@Component` that have a superclass.
- angular-eslint: `@angular-eslint/prefer-inject` removes the constructor-forwarding part of the problem.
- Metrics: depth of inheritance tree on component classes.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/component-inheritance/`](../../../angular/src/smells/angular_specific/component-inheritance/)

## References

- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *Directive composition API*: https://angular.dev/guide/directives/directive-composition-api
- Angular — *Unsubscribing with takeUntilDestroyed*: https://angular.dev/ecosystem/rxjs-interop/take-until
- angular-eslint: https://github.com/angular-eslint/angular-eslint
