# Comments (as deodorant)

> **ID:** CS021 · **Category:** Dispensables · **Sources:** Fowler 1999
>
> Comments used to explain confusing code instead of rewriting it so it explains itself.

## Definition

Fowler and Beck do not say comments are bad, but that they are often used as a **deodorant**: they appear
because the code is confusing and someone chose to explain it instead of improving it. When a block needs
a comment to be understood, first try to make the code explain itself with better names, extracted
functions and assertions.

Valuable comments explain the **why** (decisions, constraints, references), not the **what** or the
**how**, which the code itself should tell.

## Symptoms

- Comments that paraphrase line by line what the code does.
- Comments that separate sections inside a long function.
- Explanations of what a cryptically named variable means (`d  # days since signup`).
- Comments describing preconditions that the code does not check.

## Common causes

- Hard-to-read code that is "fixed" with text.
- Rules requiring every function or line to be commented.
- Lack of time or confidence to refactor.

## Why it is a problem

- Comments are neither executed nor tested: they go stale and end up lying.
- They hide the real problem (poor names, long functions).
- They duplicate information and increase the volume to read.

## Example (smelly)

```ts
function check(u: User): boolean {
  // check that the user is an adult and has a verified account
  // and has not been blocked in the last 30 days
  const d = (Date.now() - u.blockedAt) / 86400000; // days since block
  return u.age >= 18 && u.verified && d > 30;
}
```

## Solution (refactored)

```ts
const MIN_AGE = 18;
const BLOCK_COOLDOWN_DAYS = 30;
const MS_PER_DAY = 86_400_000;

function canPlaceOrder(user: User): boolean {
  return isAdult(user) && user.verified && !isRecentlyBlocked(user);
}

const isAdult = (u: User) => u.age >= MIN_AGE;
const daysSince = (ts: number) => (Date.now() - ts) / MS_PER_DAY;
const isRecentlyBlocked = (u: User) => daysSince(u.blockedAt) <= BLOCK_COOLDOWN_DAYS;
```

The comments are gone because function and constant names say the same thing, and they cannot go stale without someone noticing.

## Recommended refactorings

- **Extract Function**: a block's comment is often a good name for the function.
- **Change Function Declaration**: renames functions so they need no explanation.
- **Extract Variable**: names complex expressions.
- **Introduce Assertion**: turns a commented precondition into an executable check.

## When it may be acceptable

- Explaining the why of a non-obvious decision (a workaround, a legal constraint, a link to an issue).
- Public API documentation (docstrings, XML doc, JSDoc, Go package comments).
- Warnings about consequences (`// do not parallelize: the external API allows 1 request/s`).
- Explaining inherently complex algorithms or regular expressions.

## Related smells

- [Long Method](../01-bloaters/long-method.md) — section comments reveal long methods.
- [Redundant Comment](../09-comments/redundant-comment.md) — comments that repeat what the code says.
- [Obsolete Comment](../09-comments/obsolete-comment.md) — what happens when the code changes and the comment does not.
- [Mysterious / Uncommunicative Name](../10-names/uncommunicative-name.md) — poor names compensated for with comments.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md) — literals explained with a comment instead of a constant.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | There is no reliable detection of "deodorant" comments; Ruff `ERA001` detects commented-out code and the `D` rules (pydocstyle) handle docstrings. |
| C# | SonarQube `S125` (commented-out code); comment density is a SonarQube metric, but high density does not imply quality. |
| React + TS | `eslint-plugin-sonarjs` (commented-out code); `no-warning-comments` for TODO/FIXME. |
| Go | golangci-lint `godox` (TODO/FIXME), `godot`; manual review for the rest. |

This is a semantic smell: the most effective tool is asking in review "could the code say this by itself?".

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/excessive_comments/`](../../../python/code_smells/dispensables/excessive_comments/) |
| C# | [`csharp/src/CodeSmells/Dispensables/ExcessiveComments/`](../../../csharp/src/CodeSmells/Dispensables/ExcessiveComments/) |
| React + TS | [`react-ts/src/smells/dispensables/excessive-comments/`](../../../react-ts/src/smells/dispensables/excessive-comments/) |
| Go | [`go/smells/dispensables/excessive-comments/`](../../../go/smells/dispensables/excessive-comments/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Comments: https://refactoring.guru/smells/comments
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
