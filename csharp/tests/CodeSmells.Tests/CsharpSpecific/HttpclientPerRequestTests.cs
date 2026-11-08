using System.Net;
using CodeSmells.CsharpSpecific.HttpclientPerRequest.Refactored;
using Microsoft.Extensions.DependencyInjection;
using S = CodeSmells.CsharpSpecific.HttpclientPerRequest.Smelly;
using R = CodeSmells.CsharpSpecific.HttpclientPerRequest.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class HttpclientPerRequestTests
{
    private sealed class StubHandler : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
            Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent("1.08") });
    }

    private sealed class CountingSmellyClient : S.ExchangeRateClient
    {
        public int ClientsCreated { get; private set; }

        protected override HttpClient CreateHttpClient()
        {
            ClientsCreated++;
            return new HttpClient(new StubHandler());
        }
    }

    [Fact]
    public async Task Smelly_creates_one_client_and_connection_per_request()
    {
        var client = new CountingSmellyClient();

        for (var i = 0; i < 3; i++)
        {
            Assert.Equal(1.08m, await client.GetRateAsync("USD"));
        }

        Assert.Equal(3, client.ClientsCreated);
    }

    [Fact]
    public async Task Refactored_reuses_a_pooled_handler()
    {
        var services = new ServiceCollection();
        var handlersCreated = 0;
        services.AddExchangeRates().ConfigurePrimaryHttpMessageHandler(() =>
        {
            Interlocked.Increment(ref handlersCreated);
            return new StubHandler();
        });
        using var provider = services.BuildServiceProvider();

        for (var i = 0; i < 3; i++)
        {
            var client = provider.GetRequiredService<R.ExchangeRateClient>();
            Assert.Equal(1.08m, await client.GetRateAsync("USD"));
        }

        Assert.Equal(1, handlersCreated); // one handler shared by every typed-client instance
    }
}
