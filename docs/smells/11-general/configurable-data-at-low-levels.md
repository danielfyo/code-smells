# Configurable Data at Low Levels

> **ID:** CS076 · **Category:** General · **Sources:** Clean Code G35

*Configuration constants buried deep inside the code.*

## Definition

Configuration values (URLs, timeouts, paths, percentages, limits) appear as literals in low-level functions,
buried deep in the code. *Clean Code* (G35, *Keep Configurable Data at High Levels*) proposes defining these
values at a high level (configuration, entry point) and passing them down as parameters or dependencies.

## Symptoms

- Literal URLs, file paths or connection strings inside service classes.
- Timeouts, retries, percentages or limits as bare numbers in the middle of the logic.
- Having to recompile or redeploy to change an environment value.
- Tests that cannot change the value and end up depending on the real environment.

## Common causes

- The value was written where it was first needed.
- No established configuration mechanism.

## Why it is a problem

- **Rigidity**: changing a value means hunting it down and modifying code.
- **Fragile deployments** across environments (development, staging, production).
- **Hard testing**, and possibly secrets exposed in the repository.

## Example (smelly)

```go
func FetchExchangeRate(currency string) (float64, error) {
    // SMELL: URL and timeout buried in a low-level function
    client := &http.Client{Timeout: 3 * time.Second}
    resp, err := client.Get("https://rates.internal.example/api/v2/" + currency)
    if err != nil {
        return 0, err
    }
    defer resp.Body.Close()
    return decodeRate(resp.Body)
}
```

## Solution (refactored)

```go
type RatesConfig struct {
    BaseURL string
    Timeout time.Duration
}

type RatesClient struct {
    cfg  RatesConfig
    http *http.Client
}

// REFACTOR: configuration is decided in main and injected downwards
func NewRatesClient(cfg RatesConfig) *RatesClient {
    return &RatesClient{cfg: cfg, http: &http.Client{Timeout: cfg.Timeout}}
}

func (c *RatesClient) FetchExchangeRate(currency string) (float64, error) {
    resp, err := c.http.Get(c.cfg.BaseURL + "/" + currency)
    if err != nil {
        return 0, err
    }
    defer resp.Body.Close()
    return decodeRate(resp.Body)
}
```

## Recommended refactorings

- **Replace Magic Literal** with a named constant as a first step, then move the constant up a level.
- **Parameterize Function** or **Introduce Parameter Object** with a configuration object.
- Inject configuration through the constructor (dependency injection) from the entry point.
- Read configuration from the environment as described in *The Twelve-Factor App* (environment variables, configuration files).

## When it may be acceptable

- Truly invariant domain or physical constants (days of the week, a unit conversion factor).
- Sensible defaults that can be overridden from above.

## Related smells

- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): buried values are usually magic numbers.
- [Magic Configuration Strings](../15-csharp/magic-config-strings.md): configuration keys as strings in C#.
- [Global Data](../05-couplers/global-data.md): mutable global configuration is the wrong alternative.
- [Misplaced Responsibility](misplaced-responsibility.md): the data sits at a level where it does not belong.

## Automatic detection

- **Python**: Ruff `PLR2004` (magic values), Bandit/Ruff `S105`/`S106` (hardcoded passwords).
- **C#**: SonarQube `S1075` (hardcoded URIs) and `S2068` (hardcoded credentials).
- **TypeScript**: ESLint `no-magic-numbers`; `eslint-plugin-sonarjs` and secret scanners.
- **Go**: `mnd` (magic numbers) and `gosec` `G101` (credentials) in golangci-lint.
- **Secrets in general**: scanners such as gitleaks or GitHub secret scanning.

## Implementations

- Python: [`python/code_smells/general/configurable_data_at_low_levels/`](../../../python/code_smells/general/configurable_data_at_low_levels/)
- C#: [`csharp/src/CodeSmells/General/ConfigurableDataAtLowLevels/`](../../../csharp/src/CodeSmells/General/ConfigurableDataAtLowLevels/)
- React + TS: [`react-ts/src/smells/general/configurable-data-at-low-levels/`](../../../react-ts/src/smells/general/configurable-data-at-low-levels/)
- Go: [`go/smells/general/configurable-data-at-low-levels/`](../../../go/smells/general/configurable-data-at-low-levels/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- The Twelve-Factor App, "III. Config": https://12factor.net/config
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
