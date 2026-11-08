# Redundant Comment

> **ID:** CS053 · **Category:** Comments · **Sources:** Clean Code C3

*Comments that repeat what the code already says clearly.*

## Definition

A comment that repeats what the code already expresses clearly: "increment the counter" above `count += 1`,
or documentation that only rephrases the method name. *Clean Code* (C3, *Redundant Comment*) points out that
a comment should say something the code cannot say for itself; otherwise it is noise that can also drift out
of sync.

## Symptoms

- Line-by-line comments narrating the code (`# loop over the orders`, `// return the total`).
- Docstrings like `"""Gets the name."""` on `get_name()`.
- Auto-generated XML docs that repeat parameter and type (`<param name="id">The id</param>`).
- Closing-brace comments (`} // end if`, `} // end for`).

## Common causes

- Style rules that require commenting *everything* (every method, every parameter).
- Tools that generate documentation skeletons that are never filled with useful content.
- Insecurity about the readability of one's own code.

## Why it is a problem

- **Visual noise** that dilutes the important comments.
- **Double maintenance**: every code change requires a comment change, or leaves a stale one behind.
- Teaches readers to skip comments, including the valuable ones.

## Example (smelly)

```csharp
/// <summary>Gets the customer.</summary>
/// <param name="customerId">The customer id.</param>
/// <returns>The customer.</returns>
public Customer GetCustomer(int customerId)
{
    // Look up the customer in the repository
    var customer = _repository.Find(customerId);
    // Return the customer
    return customer; // SMELL: every comment repeats the line it sits on
}
```

## Solution (refactored)

```csharp
/// <summary>
/// Returns the customer or throws <see cref="CustomerNotFoundException"/> if it does not exist;
/// never returns null.
/// </summary>
public Customer GetCustomer(int customerId)
{
    // REFACTOR: only what the signature does not say is documented (the contract on absence)
    return _repository.Find(customerId) ?? throw new CustomerNotFoundException(customerId);
}
```

## Recommended refactorings

- **Delete the comment** when the code is already self-explanatory.
- **Rename Variable / Change Function Declaration** if the comment existed because the name was not enough.
- **Extract Function** to replace a comment describing a block with a well-named call.
- Rewrite documentation so that it explains **contracts, effects and reasons**, not mechanics.

## When it may be acceptable

- Public API and library documentation, where the documentation tool needs an entry per member; it should still add something (units, ranges, errors).
- Teaching or training material, where narrating the code is precisely the goal.
- Comments required by the language's linter (e.g. comments on exported identifiers in Go), making sure they add information.

## Related smells

- [Comments (as deodorant)](../04-dispensables/excessive-comments.md): redundancy is the most common cause of excessive comments.
- [Obsolete Comment](obsolete-comment.md): redundant comments go stale easily.
- [Mysterious / Uncommunicative Name](../10-names/uncommunicative-name.md): a bad name is often compensated with a comment.
- [Clutter](../04-dispensables/clutter.md): noise that adds no value.

## Automatic detection

- There are no reliable rules to judge whether a comment is redundant; it is a code review matter.
- **C#**: avoid auto-generating empty XML doc stubs; SonarQube reports comment density, which helps spot narrated code.
- **Go**: `revive` (`exported` rule) requires comments on exported identifiers; make sure they are not filled with redundant text.
- **Rough metric**: a very high comment density (reported by SonarQube as *comment lines density*) often signals narration of the code.

## Implementations

- Python: [`python/code_smells/comments/redundant_comment/`](../../../python/code_smells/comments/redundant_comment/)
- C#: [`csharp/src/CodeSmells/Comments/RedundantComment/`](../../../csharp/src/CodeSmells/Comments/RedundantComment/)
- React + TS: [`react-ts/src/smells/comments/redundant-comment/`](../../../react-ts/src/smells/comments/redundant-comment/)
- Go: [`go/smells/comments/redundant-comment/`](../../../go/smells/comments/redundant-comment/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 4 "Comments". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
