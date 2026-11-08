# Input Drilling

> **ID:** CS187 · **Category:** Angular-specific · **Sources:** angular.dev: dependency injection

## Definition

Passing data down through several levels of components with `input()` and bubbling events back up with `output()`,
where the intermediate components do not use the data themselves; they only forward it. It is the Angular version of
React's [Prop Drilling](../16-react-ts/prop-drilling.md).

## Symptoms

- The same input (`currency`, `currentUser`, `theme`) declared in three or more nested components.
- Intermediate templates full of `[x]="x()"` and `(changed)="changed.emit($event)"`.
- Adding a field to the data requires touching every component in the chain.
- Components that are hard to reuse because they demand inputs unrelated to their purpose.

## Common causes

- Treating inputs as the only way to share data between components.
- Not knowing that providers can be scoped to a component or route subtree.
- A container that was split into children without revisiting where the state lives.

## Why it is a problem

- **Coupling**: middle components depend on data they do not need (a [Middle Man](../05-couplers/middle-man.md)
  chain).
- **Shotgun surgery**: changing the data shape ripples through every level.
- **Noise**: templates and specs are full of forwarding boilerplate.

## How it works under the hood

Angular has a **hierarchical injector** tree. Besides the environment injectors (root, route), each component and
directive has an element injector that mirrors the view tree. A service listed in a component's `providers` gets a
new instance for that component, visible to all its descendants through `inject()` but not to siblings. Combined with
signals, the provider becomes a scoped store: the descendant that needs the value injects it and reads a signal;
intermediate components never see it, and updates reach only the views that read the signal. `InjectionToken`s let
you provide plain values (a currency code, a configuration object) the same way, and content projection
(`<ng-content>`) lets a parent pass rendered children through a layout component without forwarding inputs.

## Example (smelly)

```ts
@Component({
  selector: 'app-order-page',
  imports: [OrderSection],
  template: `<app-order-section [currency]="currency()" [lines]="lines()" />`,
})
export class OrderPage { readonly currency = signal('EUR'); readonly lines = signal<Line[]>([]); }

@Component({
  selector: 'app-order-section',
  imports: [OrderLine],
  // SMELL: forwards `currency` without using it
  template: `@for (l of lines(); track l.id) { <app-order-line [line]="l" [currency]="currency()" /> }`,
})
export class OrderSection { readonly currency = input.required<string>(); readonly lines = input.required<Line[]>(); }

@Component({ selector: 'app-order-line', template: `{{ line().amount }} {{ currency() }}` })
export class OrderLine { readonly line = input.required<Line>(); readonly currency = input.required<string>(); }
```

## Solution (refactored)

```ts
@Injectable()
export class OrderContext {                     // REFACTOR: scoped state shared via DI
  readonly currency = signal('EUR');
}

@Component({
  selector: 'app-order-page',
  imports: [OrderSection],
  providers: [OrderContext],                    // REFACTOR: one instance per page subtree
  template: `<app-order-section [lines]="lines()" />`,
})
export class OrderPage { readonly lines = signal<Line[]>([]); }

@Component({ selector: 'app-order-line', template: `{{ line().amount }} {{ ctx.currency() }}` })
export class OrderLine {
  readonly line = input.required<Line>();
  protected readonly ctx = inject(OrderContext); // REFACTOR: consumer reads it directly
}
// OrderSection now only receives `lines`.
```

## Recommended refactorings

- **Introduce a scoped service** provided at the component or route that owns the state.
- **Provide values with an `InjectionToken`** for configuration-like data.
- **Use content projection** so layout components do not need to know the data.
- Keep inputs for data the component genuinely uses: they make the contract explicit.

## When it may be acceptable

- One or two levels of forwarding: explicit inputs are easier to follow than DI.
- Reusable presentational components that should stay independent of any service.

## Related smells

- [Fat Component](./fat-component.md)
- [Hard-coded Configuration in Services](./hardcoded-config.md)
- [Prop Drilling](../16-react-ts/prop-drilling.md)
- [Middle Man](../05-couplers/middle-man.md)
- [Shotgun Surgery](../03-change-preventers/shotgun-surgery.md)

## Automatic detection

- No dedicated lint rule. Look for inputs whose only usage in the template is being passed to a child binding.
- Angular DevTools component explorer shows the same input repeated along a branch of the tree.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/input-drilling/`](../../../angular/src/smells/angular_specific/input-drilling/)

## References

- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *Hierarchical injectors*: https://angular.dev/guide/di/hierarchical-dependency-injection
- Angular — *Inputs*: https://angular.dev/guide/components/inputs
- Angular — *Signals*: https://angular.dev/guide/signals
