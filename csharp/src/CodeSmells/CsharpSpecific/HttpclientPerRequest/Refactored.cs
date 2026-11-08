using System.Globalization;
using Microsoft.Extensions.DependencyInjection;

namespace CodeSmells.CsharpSpecific.HttpclientPerRequest.Refactored;

// REFACTOR: typed client. The HttpClient is injected and created by IHttpClientFactory, which pools and
//           recycles the underlying handlers (reusing connections while still honouring DNS changes).
public class ExchangeRateClient(HttpClient httpClient)
{
    public async Task<decimal> GetRateAsync(string currency)
    {
        var body = await httpClient.GetStringAsync($"api/rates/{currency}");
        return decimal.Parse(body, CultureInfo.InvariantCulture);
    }
}

public static class ExchangeRateServiceCollectionExtensions
{
    // REFACTOR: configuration (base address, timeouts, resilience policies...) lives in one place,
    //           at the composition root.
    public static IHttpClientBuilder AddExchangeRates(this IServiceCollection services) =>
        services.AddHttpClient<ExchangeRateClient>(client =>
        {
            client.BaseAddress = new Uri("https://rates.invalid/");
            client.Timeout = TimeSpan.FromSeconds(5);
        });
}
