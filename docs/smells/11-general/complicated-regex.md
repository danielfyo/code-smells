# Complicated Regex Expression

> **ID:** CS078 · **Category:** General · **Sources:** Jerzyk 2023

*Long, cryptic regular expressions with no name, comments or decomposition.*

## Definition

A long, cryptic regular expression written on a single line, with no name, no comments and no decomposition,
that has to be deciphered character by character. Jerzyk and Madeyski catalog it as *Complicated Regex
Expression*: regexes are a language in their own right, and their density makes them especially error-prone
and hard to maintain.

## Symptoms

- Inline regexes dozens of characters long inside a condition.
- Capture groups accessed by number (`match.group(4)`).
- The same regex copied to several places with small variations.
- Nobody dares to modify it without a battery of manual tests.

## Common causes

- Trying to validate a whole format with a single expression.
- Copying regexes from the Internet without understanding them.
- Unfamiliarity with verbose mode, named groups or simpler alternatives.

## Why it is a problem

- **Errors** that are hard to spot (inputs wrongly accepted or rejected).
- **Performance**: risk of catastrophic backtracking (ReDoS).
- Costly, slow maintenance.

## Example (smelly)

```python
def parse_invoice_number(text: str) -> tuple[str, int, int]:
    # SMELL: cryptic regex with positional groups
    m = re.match(r"^([A-Z]{2,3})-(\d{4})-(\d{1,6})(?:-[RV])?$", text)
    if not m:
        raise ValueError(text)
    return m.group(1), int(m.group(2)), int(m.group(3))
```

## Solution (refactored)

```python
INVOICE_NUMBER = re.compile(
    r"""
    ^(?P<series>[A-Z]{2,3})      # series: 2-3 letters (INV, CRN)
    -(?P<year>\d{4})             # issue year
    -(?P<sequence>\d{1,6})       # sequential number
    (?:-[RV])?$                  # optional suffix: rectifying or sale
    """,
    re.VERBOSE,
)


def parse_invoice_number(text: str) -> tuple[str, int, int]:
    # REFACTOR: named regex, verbose mode and named groups
    if not (m := INVOICE_NUMBER.match(text)):
        raise ValueError(text)
    return m["series"], int(m["year"]), int(m["sequence"])
```

## Recommended refactorings

- **Extract Variable** (or a constant) to name the regex and precompile it.
- Use **verbose mode** (`re.VERBOSE`, `RegexOptions.IgnorePatternWhitespace`) and **named groups**.
- **Decompose** the regex into named pieces that are composed, or **Substitute Algorithm** with a parser or simpler string methods.
- Back it with **parameterized tests** covering valid and invalid cases.

## When it may be acceptable

- Short, very well-known regexes (`\d+`, `^\s*$`).
- Standard, well-documented and tested patterns encapsulated behind a named function.

## Related smells

- [Obscured Intent / Clever Code](obscured-intent.md): another form of cryptic code.
- [Missing Explanatory Variables](missing-explanatory-variables.md): unnamed pieces.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): unexplained literals.
- [Duplicate Code](../04-dispensables/duplicate-code.md): regexes copied to several places.

## Automatic detection

- **Several languages**: SonarQube `S5843` (*Regular expressions should not be too complicated*) and `S5852` (catastrophic backtracking risk).
- **TypeScript**: `eslint-plugin-regexp` (simplifications, unused groups, ReDoS risk) and `unicorn/better-regex`.
- **Python**: Ruff `W605` (invalid escape sequences, typical of patterns written without `r""`); the rest is review and tests.
- **Go**: the `regexp` package uses RE2 (no exponential backtracking); `gocritic` includes regex checks (`regexpMust`, `regexpSimplify`).

## Implementations

- Python: [`python/code_smells/general/complicated_regex/`](../../../python/code_smells/general/complicated_regex/)
- C#: [`csharp/src/CodeSmells/General/ComplicatedRegex/`](../../../csharp/src/CodeSmells/General/ComplicatedRegex/)
- React + TS: [`react-ts/src/smells/general/complicated-regex/`](../../../react-ts/src/smells/general/complicated-regex/)
- Go: [`go/smells/general/complicated-regex/`](../../../go/smells/general/complicated-regex/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
