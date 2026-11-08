# Multiple Languages in One Source File

> **ID:** CS066 · **Category:** General · **Sources:** Clean Code G1

*SQL, HTML, JS, XML... mixed into the same source file.*

## Definition

A single source file mixes several languages: SQL in Python strings, HTML concatenated in C#, XML or JSON
built by hand in Go, CSS and business logic in the same component. *Clean Code* (G1, *Multiple Languages in
One Source File*) recommends minimizing the number of languages per file: ideally one, and if that is not
possible, keeping the secondary ones isolated and minimal.

## Symptoms

- Long strings containing SQL, HTML or JSON built through concatenation or interpolation.
- Functions that alternate business logic with presentation templates.
- Manual escaping of quotes and special characters inside the embedded strings.
- Files that syntax highlighting cannot color correctly.

## Common causes

- Initial speed: it is easier to write the query "right there".
- Unfamiliarity with template engines, query builders or ORMs.
- No separate data access or presentation layer.

## Why it is a problem

- **Security**: interpolating SQL or HTML opens the door to SQL injection and XSS.
- **No tool support**: the embedded language is not validated, formatted or autocompleted.
- **Mixed responsibilities**: changing the format means touching the logic, and vice versa.

## Example (smelly)

```python
def customer_report(conn, customer_id: int) -> str:
    # SMELL: SQL and HTML embedded and interpolated in Python
    rows = conn.execute(
        f"SELECT number, total FROM invoices WHERE customer_id = {customer_id} ORDER BY number"
    ).fetchall()
    html = "<table><tr><th>Invoice</th><th>Total</th></tr>"
    for number, total in rows:
        html += f"<tr><td>{number}</td><td>{total:.2f}</td></tr>"
    return html + "</table>"
```

## Solution (refactored)

```python
INVOICES_BY_CUSTOMER = "SELECT number, total FROM invoices WHERE customer_id = ? ORDER BY number"


def invoices_for(conn, customer_id: int) -> list[Invoice]:
    # REFACTOR: data access is isolated and uses parameters
    return [Invoice(*row) for row in conn.execute(INVOICES_BY_CUSTOMER, (customer_id,))]


def customer_report(conn, customer_id: int) -> str:
    # REFACTOR: presentation lives in a template with autoescaping (e.g. Jinja2)
    template = env.get_template("customer_report.html")
    return template.render(invoices=invoices_for(conn, customer_id))
```

## Recommended refactorings

- **Extract Function** and **Move Function** to separate data access and presentation into different modules.
- **Split Phase**: fetch, transform and render data in independent phases.
- Move SQL into `.sql` files, query builders or ORMs, and HTML into templates (Jinja2, Razor, JSX, `html/template`).
- Always use **parameterized queries** wherever SQL remains in code.

## When it may be acceptable

- JSX/TSX in React: mixing markup and view logic is the framework's model, as long as business logic does not leak into the component.
- Short, constant, parameterized SQL queries in a dedicated repository.
- Small scripts or internal tools.

## Related smells

- [Business Logic in Components](../16-react-ts/business-logic-in-components.md): business logic mixed with the view in React.
- [Divergent Change](../03-change-preventers/divergent-change.md): the file changes for data reasons and for presentation reasons.
- [Misplaced Responsibility](misplaced-responsibility.md): code placed where it does not belong.
- [Magic Configuration Strings](../15-csharp/magic-config-strings.md): embedded strings in C#.

## Automatic detection

- **Python**: Ruff `S608` (hardcoded SQL expression, from flake8-bandit) and Bandit `B608`.
- **C#**: `CA2100` (*Review SQL queries for security vulnerabilities*) and SonarQube `S2077` (formatted SQL queries).
- **TypeScript**: `eslint-plugin-security` and SonarQube for string-built queries; `react/no-danger` for injected HTML.
- **Go**: `gosec` `G201`/`G202` (SQL built with formatting or concatenation).

## Implementations

- Python: [`python/code_smells/general/multiple_languages_in_file/`](../../../python/code_smells/general/multiple_languages_in_file/)
- C#: [`csharp/src/CodeSmells/General/MultipleLanguagesInFile/`](../../../csharp/src/CodeSmells/General/MultipleLanguagesInFile/)
- React + TS: [`react-ts/src/smells/general/multiple-languages-in-file/`](../../../react-ts/src/smells/general/multiple-languages-in-file/)
- Go: [`go/smells/general/multiple-languages-in-file/`](../../../go/smells/general/multiple-languages-in-file/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
