# Middle Man

> **ID:** CS026 · **Category:** Couplers · **Sources:** Fowler 1999
>
> A class most of whose methods only delegate to another class.

## Definition

A **middle man** is a class most of whose methods merely delegate to another class without adding
anything. Encapsulation and delegation are good, but taken to the extreme they produce layers that only
forward calls: every new operation on the delegate requires adding a forwarding method.

It is the flip side of message chains: if applying *Hide Delegate* leaves you with a class that is just
a hallway, it is time to undo part of that hiding.

## Symptoms

- Half or more of a class's methods are a single line calling the delegate.
- Every time the delegate gains an operation, the middle man needs another one.
- "Service" layers that only call the repository with the same arguments.

## Common causes

- Applying *Hide Delegate* or the Law of Demeter mechanically.
- Layered architectures that force calls through every layer even when they add nothing.
- Functionality that has gradually moved into the delegate and left the class empty.

## Why it is a problem

- Indirection without value: more code to read and maintain.
- Every change to the delegate propagates to the middle man.
- It hides where the logic really is.

## Example (smelly)

```go
type CustomerService struct{ repo *CustomerRepo }

// SMELL: every method only delegates
func (s *CustomerService) Find(id int) (Customer, error) { return s.repo.Find(id) }
func (s *CustomerService) Save(c Customer) error        { return s.repo.Save(c) }
func (s *CustomerService) Delete(id int) error          { return s.repo.Delete(id) }
```

## Solution (refactored)

```go
// REFACTOR: Remove Middle Man — clients use the repository directly
func RegisterHandlers(mux *http.ServeMux, repo *CustomerRepo) {
	mux.HandleFunc("GET /customers/{id}", func(w http.ResponseWriter, r *http.Request) {
		id, _ := strconv.Atoi(r.PathValue("id"))
		c, err := repo.Find(id)
		writeJSON(w, c, err)
	})
}
```

If the service gains logic of its own again (validation, transactions, events), bringing the layer back will be justified.

## Recommended refactorings

- **Remove Middle Man**: clients call the delegate directly.
- **Inline Function**: folds the few forwarding methods into their callers.
- **Replace Superclass with Delegate**: or **Replace Subclass with Delegate** when the delegation hides a poorly conceived inheritance relationship.

## When it may be acceptable

- Patterns with an explicit purpose: *Proxy*, *Decorator*, *Adapter*, *Facade*, which control access, add behavior or isolate a dependency.
- Module or layer boundaries that protect against changes in an unstable external dependency.
- Deliberate seams to make testing easier.

## Related smells

- [Message Chains (Train Wreck)](message-chains.md) — its opposite: the cure for one, overdone, produces the other.
- [Lazy Class / Lazy Element](../04-dispensables/lazy-class.md) — a middle man is a class that does very little.
- [Speculative Generality](../04-dispensables/speculative-generality.md) — layers added "just in case".
- [Prop Drilling](../16-react-ts/prop-drilling.md) — in React, components that only pass props down.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | No standard rule; look for classes whose methods are a single `return self.x.method(...)` statement. |
| C# | No standard Roslyn rule; NDepend allows queries for single-call methods. |
| React + TS | No standard rule; in components, prop drilling is the variant spotted in review. |
| Go | No specific linter; review types whose methods only forward to an embedded or contained field (embedding is often enough). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/middle_man/`](../../../python/code_smells/couplers/middle_man/) |
| C# | [`csharp/src/CodeSmells/Couplers/MiddleMan/`](../../../csharp/src/CodeSmells/Couplers/MiddleMan/) |
| React + TS | [`react-ts/src/smells/couplers/middle-man/`](../../../react-ts/src/smells/couplers/middle-man/) |
| Go | [`go/smells/couplers/middle-man/`](../../../go/smells/couplers/middle-man/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Middle Man: https://refactoring.guru/smells/middle-man
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
