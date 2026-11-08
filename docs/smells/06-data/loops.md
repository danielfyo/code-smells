# Loops / Imperative Loops

> **ID:** CS037 · **Category:** Data Dealers · **Sources:** Fowler 2018
>
> Hand-written loops where a collection pipeline (map/filter/reduce) would express the intent better.

## Definition

Fowler included **loops** as a smell in the second edition of *Refactoring*: in languages with first-class
functions, a hand-written loop that filters, transforms and accumulates usually expresses intent worse
than a collection pipeline (`map`, `filter`, `reduce`, comprehensions, LINQ). A loop's reader has to
reconstruct what is done with each element; the pipeline declares it step by step.

This is not about banning loops, but about recognizing when a declarative transformation communicates
better.

## Symptoms

- Loops that build an empty list and append elements conditionally.
- Hand-written accumulators for sums, maximums or groupings.
- Several purposes mixed in the same loop (filter, transform, count).
- Manual indexes (`for i in range(len(xs))`) only used to access the element.

## Common causes

- Habits acquired in languages without higher-order functions.
- The belief that pipelines are always slower.
- Loops that grow by accumulating responsibilities.

## Why it is a problem

- Intent is buried under iteration details.
- Index and accumulator initialization errors.
- It is hard to extract and reuse the steps of the transformation.

## Example (smelly)

```ts
function topCustomerEmails(orders: Order[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    if (o.total > 1000 && o.status === "paid") {
      const email = o.customer.email.toLowerCase();
      if (result.indexOf(email) === -1) {
        result.push(email);
      }
    }
  }
  return result;
}
```

## Solution (refactored)

```ts
function topCustomerEmails(orders: Order[]): string[] {
  const emails = orders
    .filter((o) => o.status === "paid" && o.total > 1000)
    .map((o) => o.customer.email.toLowerCase());
  return [...new Set(emails)];
}
```

## Recommended refactorings

- **Replace Loop with Pipeline**: turns the loop into a sequence of collection operations.
- **Split Loop**: separates a loop with several responsibilities before converting it.
- **Extract Function**: names the pipeline's predicates and transformations.

## When it may be acceptable

- Loops with complex early exits, necessary side effects or several interdependent accumulations, where a pipeline would be more cryptic.
- Measured performance-critical paths, where avoiding intermediate allocations matters.
- Go: explicit `for` loops are idiomatic (iterators arrived only in Go 1.23, alongside the `slices`/`maps` packages); do not force a functional style that is foreign to the language.

## Related smells

- [Status Variable](status-variable.md) — control flags live inside hand-written loops.
- [Mutable Data](mutable-data.md) — accumulators are mutable state.
- [range(len()) Iteration](../14-python/range-len-iteration.md) — Python variant with `range(len(...))`.
- [Overly Complex Comprehension](../14-python/complex-comprehension.md) — the opposite excess in Python: unreadable comprehensions.
- [Side Effects in LINQ](../15-csharp/linq-side-effects.md) — C# variant: pipelines with side effects.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Ruff `PERF401` (use a list comprehension), `SIM110` (use `any`/`all`); Pylint `C0200 consider-using-enumerate`. |
| C# | IDE suggestions to convert loops into LINQ (Visual Studio/Rider refactorings); SonarQube `S3267` (loops should be simplified with LINQ). |
| React + TS | `unicorn/no-for-loop`, `unicorn/prefer-array-some`, `unicorn/prefer-array-flat-map`; eslint-plugin-functional `no-loop-statements` (strict). |
| Go | golangci-lint `prealloc` (preallocate slices in loops); `gosimple`/staticcheck `S1011` (use `append(a, b...)`); `intrange` for loops over integers (Go 1.22+). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/data/loops/`](../../../python/code_smells/data/loops/) |
| C# | [`csharp/src/CodeSmells/Data/Loops/`](../../../csharp/src/CodeSmells/Data/Loops/) |
| React + TS | [`react-ts/src/smells/data/loops/`](../../../react-ts/src/smells/data/loops/) |
| Go | [`go/smells/data/loops/`](../../../go/smells/data/loops/) |
| Angular | [`angular/src/smells/data/loops/`](../../../angular/src/smells/data/loops/) |

## References

- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. (2015). *Collection Pipeline*: https://martinfowler.com/articles/collection-pipeline/
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
