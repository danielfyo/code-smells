# Magic Configuration Strings

> **ID:** CS132 · **Category:** C#/.NET-specific · **Sources:** Options pattern (Microsoft Docs)

## Definition

Configuration is read throughout the code with string keys (`_config["Smtp:Host"]`,
`_config.GetValue<int>("Billing:MaxRetries")`, `Environment.GetEnvironmentVariable("PAYMENT_KEY")`), repeated in
several classes and converted by hand. There is no single typed definition of the settings, no validation, and a typo
in a key silently returns `null` or a default value.

## Symptoms

- `IConfiguration` injected into services, controllers or domain classes.
- The same key literal repeated in several files.
- `int.Parse(_config["..."])` or `?? "default"` scattered around.
- Errors in production because a key was renamed in `appsettings.json` but not in the code (or vice versa).
- Nobody knows the full list of settings an application needs.

## Common causes

- `IConfiguration` is available everywhere through DI and is quick to use.
- Not knowing the Options pattern or how to validate it.
- Incremental growth: one setting at a time, each read where it is needed.

## Why it is a problem

- **Silent failures**: a missing or misspelled key yields `null` / `default` instead of an error at startup.
- **Duplication and inconsistency**: the same setting is parsed differently in different places.
- **Coupling**: classes depend on `IConfiguration` and on the shape of the configuration file.
- **Hard to test**: tests must build a configuration with the right string keys.
- **No discoverability**: settings are not documented by any type.

## How it works under the hood

`IConfiguration` is a flattened key-value view built from several providers (JSON files, environment variables,
command line, user secrets, Key Vault); hierarchical keys are joined with `:` (and `__` in environment variables).
Indexer access returns `string?` and never fails for an unknown key. The **Options pattern** binds a configuration
section to a POCO class (`services.AddOptions<SmtpOptions>().BindConfiguration("Smtp")`), and consumers receive
`IOptions<T>` (singleton, read once), `IOptionsSnapshot<T>` (re-read per scope) or `IOptionsMonitor<T>` (change
notifications). Validation can be added with `ValidateDataAnnotations()`, `Validate(...)` or `IValidateOptions<T>`,
and `ValidateOnStart()` makes the application fail fast at startup instead of on first use. Since .NET 8, the
configuration binding source generator can produce the binding code at compile time.

## Example (smelly)

```csharp
public class InvoiceMailer(IConfiguration config)
{
    public async Task SendAsync(Invoice invoice)
    {
        // SMELL: magic keys, manual parsing, silent defaults
        var host = config["Smtp:Host"] ?? "localhost";
        var port = int.Parse(config["Smtp:Port"] ?? "25");
        var from = config["Smtp:Form"];            // typo: always null
        var retries = config.GetValue<int>("Billing:MaxRetries");

        using var client = new SmtpClient(host, port);
        for (var i = 0; i <= retries; i++) { /* send from 'from' ... */ }
    }
}
```

## Solution (refactored)

```csharp
public sealed class SmtpOptions
{
    public const string Section = "Smtp";
    [Required] public string Host { get; set; } = "";
    [Range(1, 65535)] public int Port { get; set; } = 25;
    [Required, EmailAddress] public string From { get; set; } = "";
    [Range(0, 10)] public int MaxRetries { get; set; } = 3;
}

// Program.cs — REFACTOR: one typed definition, validated at startup
builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration(SmtpOptions.Section)
    .ValidateDataAnnotations()
    .ValidateOnStart();

public class InvoiceMailer(IOptions<SmtpOptions> options)
{
    private readonly SmtpOptions _smtp = options.Value;
    // uses _smtp.Host, _smtp.Port, _smtp.From, _smtp.MaxRetries
}
```

## Recommended refactorings

- **Introduce Parameter Object / Options class** per configuration section.
- **Bind with `BindConfiguration`** and inject `IOptions<T>` (or `IOptionsMonitor<T>` for reloadable settings).
- **Validate** with data annotations or `IValidateOptions<T>` and **fail fast** with `ValidateOnStart()`.
- **Keep `IConfiguration` in the Composition Root**; inject only the options each class needs.
- Use a `const string Section` (or `nameof`) instead of repeating section names.

## When it may be acceptable

- `Program.cs` / startup code that reads a handful of values to decide how to wire the application.
- Tiny tools or scripts with one or two settings.
- Dynamic, user-defined keys (feature flags by name, per-tenant settings) where a fixed class is not possible; even
  then, centralize access in one service.

## Related smells

- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md)
- [Configurable Data at Low Levels](../11-general/configurable-data-at-low-levels.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Service Locator Anti-pattern](service-locator.md): injecting `IConfiguration` everywhere is a close relative.
- [Stringly-typed Dicts instead of Classes (Python)](../14-python/dict-as-object.md)

## Automatic detection

No standard .NET analyzer rule flags string-keyed configuration access. Useful measures: architecture tests or
`BannedApiAnalyzers` (`RS0030`) forbidding `IConfiguration` outside the Composition Root, searching for repeated key
literals, and relying on `ValidateOnStart()` so that missing configuration breaks the application at startup and in
integration tests.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/MagicConfigStrings/`](../../../csharp/src/CodeSmells/CsharpSpecific/MagicConfigStrings/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *Options pattern in .NET*: https://learn.microsoft.com/dotnet/core/extensions/options
- Microsoft Learn, *Options pattern in ASP.NET Core*: https://learn.microsoft.com/aspnet/core/fundamentals/configuration/options
- Microsoft Learn, *Configuration in .NET*: https://learn.microsoft.com/dotnet/core/extensions/configuration
- Microsoft Learn, *Configuration binding source generator*:
  https://learn.microsoft.com/dotnet/core/extensions/configuration-generator
