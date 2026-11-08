# React + TS-specific smells

> **Category:** React + TS-specific · **Smells:** 22 · **Code folder:** `react-ts/src/smells/react_ts_specific/`

This category collects anti-patterns specific to **React** and **TypeScript**. Many of them do not look like
"classic" smells (long methods, large classes); they come from misunderstanding how the runtime works:

- **Reconciliation and identity**: React decides whether an element is "the same" by its type, position and `key`.
  Unstable keys or components defined inside other components lose state.
- **Renders as snapshots**: each render is a call with its own constant props and state; closures capture those values,
  which is why hook dependency arrays matter.
- **Effects are for synchronising with external systems**: effects run after the commit, need a cleanup and should not
  be used to derive state or to chain updates.
- **Immutability**: React compares references with `Object.is`; mutating state means no re-render.
- **Structural typing and type erasure**: TypeScript types disappear at runtime, so `any`, `as` and `!` silence the
  compiler without adding any check. External data must be validated with real code.

Detection relies mainly on `eslint-plugin-react-hooks` (`rules-of-hooks`, `exhaustive-deps`), `eslint-plugin-react`
(`no-array-index-key`, `no-unstable-nested-components`, `jsx-props-no-spreading`, `jsx-no-constructed-context-values`),
`typescript-eslint` (`no-explicit-any`, `no-non-null-assertion`, `consistent-type-assertions`) and TypeScript's `strict`
mode.

Each smell has its own document (definition, symptoms, causes, consequences, how it works under the hood, smelly and refactored snippets, refactorings, exceptions, related smells, automatic detection and references) and a code folder with a `smelly` and a `refactored` version plus tests. Since these smells are language-specific, they are implemented only in this language.

Run the examples with `cd react-ts && npm run check`.

## Smells in this category

| ID | Smell | Summary | Code |
|---|---|---|---|
| CS133 | [Prop Drilling](./prop-drilling.md) | Passing props through many intermediate components that do not use them. | [`prop-drilling/`](../../../react-ts/src/smells/react_ts_specific/prop-drilling/) |
| CS134 | [God Component / Large Component](./god-component.md) | One component fetches data, manages state, holds business logic and renders the whole UI. | [`god-component/`](../../../react-ts/src/smells/react_ts_specific/god-component/) |
| CS135 | [Derived State via useEffect](./derived-state-in-effect.md) | Computing in an effect + setState something that can be computed during render. | [`derived-state-in-effect/`](../../../react-ts/src/smells/react_ts_specific/derived-state-in-effect/) |
| CS136 | [Props Copied into State](./props-copied-to-state.md) | Initialising useState from a prop creates two sources of truth that drift apart. | [`props-copied-to-state/`](../../../react-ts/src/smells/react_ts_specific/props-copied-to-state/) |
| CS137 | [Missing Effect Cleanup](./missing-effect-cleanup.md) | Subscriptions, timers or listeners that are never removed. | [`missing-effect-cleanup/`](../../../react-ts/src/smells/react_ts_specific/missing-effect-cleanup/) |
| CS138 | [Stale Closure / Missing Dependencies](./stale-closure.md) | Omitting hook dependencies makes them read outdated values. | [`stale-closure/`](../../../react-ts/src/smells/react_ts_specific/stale-closure/) |
| CS139 | [Direct State Mutation](./direct-state-mutation.md) | Mutating state objects or arrays instead of creating new ones: React does not re-render. | [`direct-state-mutation/`](../../../react-ts/src/smells/react_ts_specific/direct-state-mutation/) |
| CS140 | [Array Index as Key](./index-as-key.md) | Using the index as key in changing lists mixes up state and DOM. | [`index-as-key/`](../../../react-ts/src/smells/react_ts_specific/index-as-key/) |
| CS141 | [any Abuse](./any-type.md) | `any` disables the type system and silently propagates errors. | [`any-type/`](../../../react-ts/src/smells/react_ts_specific/any-type/) |
| CS142 | [Non-null Assertion Abuse](./non-null-assertion.md) | `value!` lies to the compiler about values that can be null. | [`non-null-assertion/`](../../../react-ts/src/smells/react_ts_specific/non-null-assertion/) |
| CS143 | [Type Assertion (as) Abuse](./type-assertion-abuse.md) | `as Type` forces external data into a shape without runtime validation. | [`type-assertion-abuse/`](../../../react-ts/src/smells/react_ts_specific/type-assertion-abuse/) |
| CS144 | [Component Defined Inside Component](./component-inside-component.md) | Defining components inside another one recreates them on every render and loses their state. | [`component-inside-component/`](../../../react-ts/src/smells/react_ts_specific/component-inside-component/) |
| CS145 | [Boolean Props Explosion](./boolean-prop-explosion.md) | isPrimary, isDanger, isSmall... impossible combinations instead of a typed variant. | [`boolean-prop-explosion/`](../../../react-ts/src/smells/react_ts_specific/boolean-prop-explosion/) |
| CS146 | [Nested Ternaries in JSX](./nested-ternaries-jsx.md) | Ternaries inside ternaries to decide what to render. | [`nested-ternaries-jsx/`](../../../react-ts/src/smells/react_ts_specific/nested-ternaries-jsx/) |
| CS147 | [Chains of Effects](./effect-chains.md) | Effects that update state which triggers other effects in a cascade. | [`effect-chains/`](../../../react-ts/src/smells/react_ts_specific/effect-chains/) |
| CS148 | [Monolithic / Overused Context](./context-overuse.md) | One giant context for everything causes massive re-renders and coupling. | [`context-overuse/`](../../../react-ts/src/smells/react_ts_specific/context-overuse/) |
| CS149 | [Premature Memoization](./premature-memoization.md) | useMemo/useCallback/memo everywhere without measuring, adding complexity without benefit. | [`premature-memoization/`](../../../react-ts/src/smells/react_ts_specific/premature-memoization/) |
| CS150 | [Fetch in Effect without Abort](./fetch-race-condition.md) | Requests in effects without cancellation: stale responses overwrite newer ones. | [`fetch-race-condition/`](../../../react-ts/src/smells/react_ts_specific/fetch-race-condition/) |
| CS151 | [Stringly Typed Code](./stringly-typed.md) | Free-form strings where a literal union or discriminated type would give safety. | [`stringly-typed/`](../../../react-ts/src/smells/react_ts_specific/stringly-typed/) |
| CS152 | [Too Many Related useState](./useState-explosion.md) | Many related useState hooks that must change together; useReducer or an object is better. | [`useState-explosion/`](../../../react-ts/src/smells/react_ts_specific/useState-explosion/) |
| CS153 | [Business Logic in Components](./business-logic-in-components.md) | Business rules mixed with JSX instead of living in hooks or pure modules. | [`business-logic-in-components/`](../../../react-ts/src/smells/react_ts_specific/business-logic-in-components/) |
| CS154 | [Indiscriminate Props Spreading](./props-spreading.md) | `{...props}` passes unknown attributes to the DOM and hides the component contract. | [`props-spreading/`](../../../react-ts/src/smells/react_ts_specific/props-spreading/) |

## References

- React — *You Might Not Need an Effect*: https://react.dev/learn/you-might-not-need-an-effect
- React — *Synchronizing with Effects*: https://react.dev/learn/synchronizing-with-effects
- React — *Rendering Lists*: https://react.dev/learn/rendering-lists
- React — *Choosing the State Structure*: https://react.dev/learn/choosing-the-state-structure
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- typescript-eslint rules: https://typescript-eslint.io/rules/
- Ferreira, F.; Valente, M. T. — *Detecting code smells in React-based Web apps* (2022).
