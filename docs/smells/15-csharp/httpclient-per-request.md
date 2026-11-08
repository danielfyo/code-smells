# new HttpClient per Request

> **ID:** CS120 · **Category:** C#/.NET-specific · **Sources:** Microsoft Docs

## Definition

A new `HttpClient` is created (usually inside a `using`) on every call to an external HTTP service. Although it looks
like the "correct" way to treat an `IDisposable`, each instance has its own connection pool and, when disposed,
leaves sockets in `TIME_WAIT`. Under load, the operating system runs out of ports.

## Symptoms

- `using var client = new HttpClient();` inside a method called per request or per item.
- `SocketException` ("Only one usage of each socket address is normally permitted" / "Address already in use")
  under load.
- High latency from repeating the TCP and TLS handshake on every call.
- `netstat` shows thousands of connections in `TIME_WAIT` to the same destination.

## Common causes

- Mechanically applying the rule "every `IDisposable` goes in a `using`".
- Old or simplified samples.
- Needing different headers or settings per call and solving it by creating new clients.

## Why it is a problem

- **Port (socket) exhaustion** and service outages during traffic spikes.
- **Worse performance**: without connection reuse, each request pays for DNS, TCP and TLS.
- **Instability in containers** with connection limits.
- The problem does not show up in development, only at volume.

## How it works under the hood

`HttpClient` delegates to an `HttpMessageHandler` (in .NET Core 2.1+, `SocketsHttpHandler`) that maintains a **pool
of reusable connections**. Disposing a client that owns its handler closes its connections; but TCP keeps the local
port in `TIME_WAIT` for a while (up to several minutes depending on the OS) before releasing it. Creating and
destroying clients at a high rate piles up occupied ports until they run out. The opposite extreme — a single static
`HttpClient` forever — reuses connections but misses DNS changes, because DNS is only resolved when a connection is
created. The two official solutions are a long-lived client with `SocketsHttpHandler.PooledConnectionLifetime`
configured, or `IHttpClientFactory`, which reuses and recycles handlers (every two minutes by default) while handing
out lightweight clients.

## Example (smelly)

```csharp
public class ExchangeRateService
{
    public async Task<decimal> GetRateAsync(string currency, CancellationToken ct)
    {
        // SMELL: a new connection pool on every call; sockets left in TIME_WAIT
        using var client = new HttpClient { BaseAddress = new Uri("https://rates.example.com/") };
        var dto = await client.GetFromJsonAsync<RateDto>($"rates/{currency}", ct);
        return dto!.Rate;
    }
}
```

## Solution (refactored)

```csharp
// Program.cs — REFACTOR: typed client managed by IHttpClientFactory
builder.Services.AddHttpClient<ExchangeRateService>(client =>
{
    client.BaseAddress = new Uri("https://rates.example.com/");
    client.Timeout = TimeSpan.FromSeconds(5);
});

public class ExchangeRateService(HttpClient client)
{
    public async Task<decimal> GetRateAsync(string currency, CancellationToken ct)
    {
        var dto = await client.GetFromJsonAsync<RateDto>($"rates/{currency}", ct)
            ?? throw new InvalidOperationException($"No exchange rate for {currency}");
        return dto.Rate;
    }
}
```

Without a DI container: `static readonly HttpClient Client = new(new SocketsHttpHandler
{ PooledConnectionLifetime = TimeSpan.FromMinutes(2) });`

## Recommended refactorings

- **Typed or named clients** registered with `AddHttpClient` (`IHttpClientFactory`).
- **Static or singleton client** with `PooledConnectionLifetime` when there is no DI.
- **Per-request headers** via `HttpRequestMessage` instead of creating differently configured clients.
- Add resilience with `Microsoft.Extensions.Http.Resilience` (retries, timeouts, circuit breaker).

## When it may be acceptable

- Console apps or tools that make a handful of requests and exit.
- Tests that create one client per test (for example `WebApplicationFactory.CreateClient()`).
- Clients created by `IHttpClientFactory`: they are short-lived by design and disposing them does not close the
  handler.

## Related smells

- [Missing using / IDisposable Leak](missing-dispose.md): the case where applying `using` blindly backfires.
- [Control Freak (newing dependencies)](new-in-constructor.md)
- [Magic Configuration Strings](magic-config-strings.md)
- [Sync over Async](sync-over-async.md)

## Automatic detection

There is no standard .NET analyzer rule for this pattern (paradoxically, `CA2000` pushes you to add the `using`). It
is found in code review by searching for `new HttpClient(` outside startup configuration, with custom rules (for
example `Microsoft.CodeAnalysis.BannedApiAnalyzers`, rule `RS0030`, to ban the constructor) and with connection
metrics (`dotnet-counters` with `System.Net.Http`).

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/HttpclientPerRequest/`](../../../csharp/src/CodeSmells/CsharpSpecific/HttpclientPerRequest/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *Guidelines for using HttpClient*:
  https://learn.microsoft.com/dotnet/fundamentals/networking/http/httpclient-guidelines
- Microsoft Learn, *IHttpClientFactory with .NET*: https://learn.microsoft.com/dotnet/core/extensions/httpclient-factory
- Microsoft Learn, *Make HTTP requests using IHttpClientFactory in ASP.NET Core*:
  https://learn.microsoft.com/aspnet/core/fundamentals/http-requests
- Microsoft Learn, *Use IHttpClientFactory to implement resilient HTTP requests*:
  https://learn.microsoft.com/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests
