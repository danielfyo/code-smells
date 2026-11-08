# Test Smells

Test code deserves the same care as production code: *Clean Code* (ch. 9) insists that tests must be kept
clean because they are what makes change safe. This category covers smells in the test suite itself: missing or
ignored tests, slow and flaky tests, and tests that are hard to read or break for the wrong reasons. It draws on
three main sources: the test heuristics of *Clean Code* chapter 17 (**T1 to T9**), Gerard Meszaros's *xUnit
Test Patterns* (2007), which systematized test smells and the patterns that fix them, and the empirical test
smell research started by van Deursen, Moonen, van den Bergh and Kok ("Refactoring Test Code", 2001) and
continued by later studies such as Peruma et al. (2019), summarized at https://testsmells.org.

## Smells in this category

| ID | Smell | Sources | Summary |
|---|---|---|---|
| CS080 | [Insufficient Tests](insufficient-tests.md) | Clean Code T1/T2/T8 | Only the happy path is tested; there is no coverage tool and relevant cases are untested. |
| CS081 | [Ignored Tests](ignored-tests.md) | Clean Code T4 | Tests disabled or skipped with no documented reason that nobody ever re-enables. |
| CS082 | [Untested Boundary Conditions](untested-boundaries.md) | Clean Code T3/T5/T6 | Boundary cases and the surroundings of known bugs are not tested. |
| CS083 | [Slow Tests](slow-tests.md) | Clean Code T9; Meszaros 2007 | Tests that depend on the network, disk or real waits and take so long nobody runs them. |
| CS084 | [Assertion Roulette](assertion-roulette.md) | van Deursen 2001; Meszaros 2007 | Many assertions without messages in one test: when it fails, nobody knows which one or why. |
| CS085 | [Mystery Guest](mystery-guest.md) | van Deursen 2001; Meszaros 2007 | The test depends on external resources (files, databases) that are invisible when reading it. |
| CS086 | [Eager Test](eager-test.md) | van Deursen 2001 | A single test verifies many different behaviors at once. |
| CS087 | [Conditional Test Logic](conditional-test-logic.md) | Meszaros 2007 | Tests with if statements, loops or try/catch that may never execute their assertions. |
| CS088 | [Sleepy Test](sleepy-test.md) | Peruma 2019 | Using sleep to wait for asynchronous work: slow, nondeterministic tests. |
| CS089 | [Fragile Test / Testing Implementation Details](fragile-test.md) | Meszaros 2007 | Tests coupled to implementation details that break with any refactoring. |
| CS090 | [Interdependent Tests / Shared Fixture](interdependent-tests.md) | Meszaros 2007 | Tests that share mutable state and only pass in a specific order. |

## Mapping to Clean Code (chapter 17, T1-T9)

| Code | Heuristic | Smell in this catalog |
|---|---|---|
| T1 | Insufficient Tests | [Insufficient Tests](insufficient-tests.md) |
| T2 | Use a Coverage Tool! | [Insufficient Tests](insufficient-tests.md) |
| T3 | Don't Skip Trivial Tests | [Untested Boundary Conditions](untested-boundaries.md) |
| T4 | An Ignored Test Is a Question about an Ambiguity | [Ignored Tests](ignored-tests.md) |
| T5 | Test Boundary Conditions | [Untested Boundary Conditions](untested-boundaries.md) |
| T6 | Exhaustively Test Near Bugs | [Untested Boundary Conditions](untested-boundaries.md) |
| T7 | Patterns of Failure Are Revealing | No dedicated entry |
| T8 | Test Coverage Patterns Can Be Revealing | [Insufficient Tests](insufficient-tests.md) |
| T9 | Tests Should Be Fast | [Slow Tests](slow-tests.md) |

T7 is diagnostic advice (look at which tests fail together) rather than a smell of its own.

## xUnit Test Patterns and test smell research

- **Meszaros (2007)** classifies test smells into code smells (*Obscure Test*, *Conditional Test Logic*,
  *Hard-to-Test Code*, *Test Code Duplication*), behavior smells (*Assertion Roulette*, *Erratic Test*,
  *Fragile Test*, *Slow Tests*) and project smells. In this catalog: [Conditional Test Logic](conditional-test-logic.md), [Assertion Roulette](assertion-roulette.md), [Fragile Test / Testing Implementation Details](fragile-test.md), [Interdependent Tests / Shared Fixture](interdependent-tests.md), [Slow Tests](slow-tests.md), [Mystery Guest](mystery-guest.md).
- **van Deursen et al. (2001)** introduced eleven test smells together with test-specific refactorings
  (*Inline Resource*, *Setup External Resource*, *Add Assertion Explanation*, *Make Resource Unique*...).
  In this catalog: [Assertion Roulette](assertion-roulette.md), [Mystery Guest](mystery-guest.md), [Eager Test](eager-test.md).
- **Peruma et al. (2019)** extended the list with smells such as [Sleepy Test](sleepy-test.md);
  their detection tool, tsDetect, targets Java/JUnit and is described at https://testsmells.org.

## Implementation notes

In the code folders for this category, the production code under test is shared, the `smelly` test files
contain the smelly test and the `refactored` ones the clean test. Both versions always pass (sleepy tests use
short waits, under 300 ms), because the smell lies in how the tests are written, not in whether they pass.

## How to read each entry

Every document follows the same structure: definition, symptoms, common causes, why it is a problem, a short
smelly example and its refactored solution, recommended refactorings, when it may be acceptable, related
smells, automatic detection and links to the implementations in Python, C#, React + TypeScript and Go. The
full catalog is in [`docs/CATALOG.md`](../../CATALOG.md) and the repository conventions in
[`docs/CONVENTIONS.md`](../../CONVENTIONS.md).

## References

- Martin, R. C. (2008). *Clean Code*, ch. 9 "Unit Tests". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Meszaros, G. (2007). *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley.
- van Deursen, A., Moonen, L., van den Bergh, A. and Kok, G. (2001). "Refactoring Test Code". *Proceedings of the 2nd International Conference on Extreme Programming and Flexible Processes (XP2001)*.
- Peruma, A. et al. (2019). "On the Distribution of Test Smells in Open Source Android Applications: An Exploratory Study". *CASCON 2019*.
- Test smells catalog (tsDetect and related research): https://testsmells.org
- Beck, K. (2002). *Test-Driven Development: By Example*. Addison-Wesley.
