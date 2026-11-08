# Angular-specific smells

> **Category:** Angular-specific · **Smells:** 22 · **Code folder:** `angular/src/smells/angular_specific/`

This category collects anti-patterns specific to **Angular**, **RxJS** and **signals**. Like the React ones, most of
them come from misunderstanding how the framework works at runtime rather than from "classic" design problems:

- **Change detection**: Angular re-evaluates template bindings when it checks a view. With the `Default` strategy every
  component is checked on every pass; with `OnPush` a component and its subtree are skipped unless an input reference
  changed, an event was handled inside it, it was marked for check or a signal it reads changed. Method calls in
  templates, mutated objects and manual `detectChanges()` calls all fight this model.
- **Zoneless**: without zone.js, Angular no longer runs change detection after every timer, promise or XHR. A pass is
  scheduled only when something notifies the framework (signal writes read by a template, template events, the
  `async` pipe, `markForCheck()`), so code that relied on implicit global checks stops updating.
- **Signals**: `signal()` holds state, `computed()` derives it lazily and memoizes it, and `effect()` synchronises with
  the outside world. Signals compare values with `Object.is`, so in-place mutation is invisible; derived state belongs
  in `computed()`, not in effects that write other signals.
- **RxJS subscriptions**: most Angular observables (`HttpClient`) are cold, so every `subscribe()` (and every `async`
  pipe) starts a new execution, and non-completing streams must be unsubscribed. Higher-order operators
  (`switchMap`, `concatMap`...), `takeUntilDestroyed()` / `DestroyRef`, `toSignal()` and the `async` pipe manage those
  lifetimes for you.
- **Dependency injection**: the hierarchical injector (environment, route and element injectors), `inject()` and
  `InjectionToken` replace input drilling, hard-coded configuration, catch-all modules and inheritance-based reuse.
- **Type safety in templates and forms**: `strictTemplates` type-checks templates and typed reactive forms type-check
  form values; `$any()`, `any` fields and `Untyped*` forms switch those checks off. `DomSanitizer` protects bound HTML
  and URLs unless it is bypassed.

Detection relies mainly on angular-eslint (`@angular-eslint/prefer-on-push-component-change-detection`,
`@angular-eslint/template/no-call-expression`, `@angular-eslint/template/no-any`,
`@angular-eslint/template/use-track-by-function`, `@angular-eslint/prefer-standalone`,
`@angular-eslint/no-lifecycle-call`), RxJS lint plugins (eslint-plugin-rxjs / rxjs-x: `no-nested-subscribe`,
`no-ignored-subscription`, `no-topromise`, `no-async-subscribe`), typescript-eslint (`no-explicit-any`,
`no-floating-promises`), the compiler's `strictTemplates` mode and Angular's extended diagnostics.

Each smell has its own document (definition, symptoms, causes, consequences, how it works under the hood, smelly and refactored snippets, refactorings, exceptions, related smells, automatic detection and references) and a code folder with a `smelly` and a `refactored` version plus tests (Vitest + TestBed, zoneless). Since these smells are framework-specific, they are implemented only in Angular.

Run the examples with `cd angular && npm ci && npm run check`.

## Smells in this category

| ID | Smell | Summary | Code |
|---|---|---|---|
| CS177 | [Subscription Leak](./subscription-leak.md) | subscribe() calls that are never unsubscribed keep running after the component is destroyed. | [`subscription-leak/`](../../../angular/src/smells/angular_specific/subscription-leak/) |
| CS178 | [Nested Subscribes](./nested-subscribes.md) | subscribe() inside subscribe() instead of switchMap/concatMap/mergeMap: races, leaks and callback hell. | [`nested-subscribes/`](../../../angular/src/smells/angular_specific/nested-subscribes/) |
| CS179 | [Function Calls in Templates](./function-calls-in-template.md) | Methods called from templates run on every change detection cycle; use computed signals or pure pipes. | [`function-calls-in-template/`](../../../angular/src/smells/angular_specific/function-calls-in-template/) |
| CS180 | [Fat Component](./fat-component.md) | A component that fetches data, holds business rules, manages state and renders everything. | [`fat-component/`](../../../angular/src/smells/angular_specific/fat-component/) |
| CS181 | [Default Change Detection Everywhere](./default-change-detection.md) | Components without OnPush (or signal-driven updates) are checked on every event in the whole app. | [`default-change-detection/`](../../../angular/src/smells/angular_specific/default-change-detection/) |
| CS182 | [Manual Change Detection Hacks](./manual-change-detection.md) | detectChanges(), markForCheck() or setTimeout() sprinkled around to force the view to update. | [`manual-change-detection/`](../../../angular/src/smells/angular_specific/manual-change-detection/) |
| CS183 | [Direct DOM Manipulation](./direct-dom-manipulation.md) | ElementRef.nativeElement or document.querySelector to change the view instead of bindings. | [`direct-dom-manipulation/`](../../../angular/src/smells/angular_specific/direct-dom-manipulation/) |
| CS184 | [Public Mutable Service State](./mutable-service-state.md) | Services exposing mutable arrays or objects that any component can change without notification. | [`mutable-service-state/`](../../../angular/src/smells/angular_specific/mutable-service-state/) |
| CS185 | [Tracking by Index](./index-as-track.md) | @for blocks tracked by $index on reorderable lists: DOM and state get mixed up. | [`index-as-track/`](../../../angular/src/smells/angular_specific/index-as-track/) |
| CS186 | [Logic in Constructors](./constructor-logic.md) | Constructors that read inputs, call services or start work instead of declaring dependencies. | [`constructor-logic/`](../../../angular/src/smells/angular_specific/constructor-logic/) |
| CS187 | [Input Drilling](./input-drilling.md) | Data passed through several components via inputs and outputs that do not use it. | [`input-drilling/`](../../../angular/src/smells/angular_specific/input-drilling/) |
| CS188 | [Shared Module Dumping Ground](./shared-module-dumping-ground.md) | A SharedModule that imports and re-exports everything, hiding real dependencies. | [`shared-module-dumping-ground/`](../../../angular/src/smells/angular_specific/shared-module-dumping-ground/) |
| CS189 | [HttpClient in Components](./http-in-components.md) | Components that build URLs and call HttpClient directly instead of using a data service. | [`http-in-components/`](../../../angular/src/smells/angular_specific/http-in-components/) |
| CS190 | [Mixing Promises and Observables](./promise-observable-mixing.md) | toPromise(), async/await and subscribe() mixed in the same flow, losing cancellation. | [`promise-observable-mixing/`](../../../angular/src/smells/angular_specific/promise-observable-mixing/) |
| CS191 | [effect() for Derived State](./effect-for-derived-state.md) | Writing signals from effect() to compute state that computed() would derive. | [`effect-for-derived-state/`](../../../angular/src/smells/angular_specific/effect-for-derived-state/) |
| CS192 | [Mutating Inputs](./mutating-inputs.md) | Child components that mutate objects received as inputs, changing the parent's state behind its back. | [`mutating-inputs/`](../../../angular/src/smells/angular_specific/mutating-inputs/) |
| CS193 | [Duplicate async Subscriptions](./duplicate-async-subscriptions.md) | The same cold observable bound with several async pipes triggers several HTTP requests. | [`duplicate-async-subscriptions/`](../../../angular/src/smells/angular_specific/duplicate-async-subscriptions/) |
| CS194 | [Hard-coded Configuration in Services](./hardcoded-config.md) | API URLs and feature flags written inside services instead of injected configuration. | [`hardcoded-config/`](../../../angular/src/smells/angular_specific/hardcoded-config/) |
| CS195 | [Bypassing the Sanitizer](./sanitizer-bypass.md) | bypassSecurityTrustHtml on user content opens the door to XSS. | [`sanitizer-bypass/`](../../../angular/src/smells/angular_specific/sanitizer-bypass/) |
| CS196 | [Component Inheritance Hierarchies](./component-inheritance.md) | Base component classes that share behavior through inheritance instead of composition. | [`component-inheritance/`](../../../angular/src/smells/angular_specific/component-inheritance/) |
| CS197 | [Untyped Forms](./untyped-forms.md) | UntypedFormGroup / any-typed form values that lose compile-time checking. | [`untyped-forms/`](../../../angular/src/smells/angular_specific/untyped-forms/) |
| CS198 | [$any() and any in Templates](./any-in-templates.md) | $any() casts and any-typed fields that switch off template type checking. | [`any-in-templates/`](../../../angular/src/smells/angular_specific/any-in-templates/) |

## References

- Angular — *Signals*: https://angular.dev/guide/signals
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
- Angular — *Zoneless*: https://angular.dev/guide/zoneless
- Angular — *Control flow*: https://angular.dev/guide/templates/control-flow
- Angular — *Unsubscribing with takeUntilDestroyed*: https://angular.dev/ecosystem/rxjs-interop/take-until
- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *Typed forms*: https://angular.dev/guide/forms/typed-forms
- Angular — *Template type checking*: https://angular.dev/tools/cli/template-typecheck
- Angular — *Security*: https://angular.dev/best-practices/security
- Angular — *Style guide*: https://angular.dev/style-guide
- RxJS documentation: https://rxjs.dev
- angular-eslint: https://github.com/angular-eslint/angular-eslint
