# Inconsistent Names

> **ID:** CS063 · **Category:** Names · **Sources:** Clean Code G11; Jerzyk 2023

*The same concept goes by several names (fetch/get/retrieve, user/client/customer).*

## Definition

The same concept has different names in different parts of the code (`fetchUser`, `getClient`,
`retrieveCustomer`), or the same verb means different things. *Clean Code* (G11, *Inconsistency*) asks that
if something is done one way, it be done the same way everywhere similar; Jerzyk and Madeyski include it in
their catalog as *Inconsistent Names*.

## Symptoms

- Synonyms for the same concept: `user`/`client`/`customer`, `order`/`purchase`.
- Mixed verbs for the same operation: `get`/`fetch`/`retrieve`/`load`.
- Classes with different suffixes for the same role: `OrderManager`, `InvoiceService`, `PaymentHandler`.
- The same field named differently in the API, the model and the database for no clear reason.

## Common causes

- Several developers or teams working without a common glossary.
- Code copied from different projects.
- Business vocabulary evolving without renaming old code.

## Why it is a problem

- **Constant doubt**: are `client` and `customer` the same thing, or is there a subtle difference?
- **Incomplete searches** when refactoring or investigating a concept.
- Duplicated functionality because nobody finds the existing version under another name.

## Example (smelly)

```python
class CustomerRepository:
    def fetch_client(self, client_id: int) -> Customer: ...
    def get_user_orders(self, user_id: int) -> list[Order]: ...
    def retrieve_customer_address(self, cust_id: int) -> Address: ...
# SMELL: three verbs and three nouns for the same concept
```

## Solution (refactored)

```python
class CustomerRepository:
    # REFACTOR: one concept, one name; one verb, one meaning
    def get_customer(self, customer_id: int) -> Customer: ...
    def get_customer_orders(self, customer_id: int) -> list[Order]: ...
    def get_customer_address(self, customer_id: int) -> Address: ...
```

## Recommended refactorings

- **Rename (Rename Variable / Rename Field / Change Function Declaration)** to unify the vocabulary.
- Define a **glossary** (ubiquitous language) and a verb convention (`get` = fetch existing, `find` = may not exist, `create`...).
- **Substitute Algorithm** or remove duplicates discovered while unifying names.

## When it may be acceptable

- Concepts that really are different even if they look alike (a `User` who logs in versus a `Customer` who buys); in that case the difference should be documented.
- Boundaries with external systems, where their vocabulary is kept in the translation layer.

## Related smells

- [Non-Standard Nomenclature](non-standard-nomenclature.md): ignoring well-known conventions.
- [Oddball Solution](../11-general/oddball-solution.md): inconsistency applied to solutions rather than names.
- [Alternative Classes with Different Interfaces](../02-oo-abusers/alternative-classes-different-interfaces.md): equivalent classes with different interfaces.
- [Duplicate Code](../04-dispensables/duplicate-code.md): often hidden behind different names.

## Automatic detection

- Tools do not know domain synonyms; detection is manual (review, searches for `fetch|retrieve|get`).
- **Spelling and vocabulary**: `cspell`/`codespell` with project dictionaries help fix terms and spot variants.
- **Form conventions**: Pylint/Ruff `N8xx`, `@typescript-eslint/naming-convention`, `.editorconfig` rules in C# and `revive` in Go at least guarantee consistent style.

## Implementations

- Python: [`python/code_smells/names/inconsistent_names/`](../../../python/code_smells/names/inconsistent_names/)
- C#: [`csharp/src/CodeSmells/Names/InconsistentNames/`](../../../csharp/src/CodeSmells/Names/InconsistentNames/)
- React + TS: [`react-ts/src/smells/names/inconsistent-names/`](../../../react-ts/src/smells/names/inconsistent-names/)
- Go: [`go/smells/names/inconsistent-names/`](../../../go/smells/names/inconsistent-names/)
- Angular: [`angular/src/smells/names/inconsistent-names/`](../../../angular/src/smells/names/inconsistent-names/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
