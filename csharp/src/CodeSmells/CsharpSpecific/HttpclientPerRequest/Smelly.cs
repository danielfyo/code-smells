using System.Globalization;

namespace CodeSmells.CsharpSpecific.HttpclientPerRequest.Smelly;

public class ExchangeRateClient
{
    public async Task<decimal> GetRateAsync(string currency)
    {
        // SMELL: a brand-new HttpClient (and HttpMessageHandler) per call. Disposing it does not free the
        //        socket immediately (TIME_WAIT), so under load the machine runs out of ports
        //        (SocketException), every call pays a new DNS lookup + TCP/TLS handshake, and DNS changes
        //        are never picked up if someone "fixes" it with a static client instead.
        using var client = CreateHttpClient();
        client.BaseAddress = new Uri("https://rates.invalid/");
        var body = await client.GetStringAsync($"api/rates/{currency}");
        return decimal.Parse(body, CultureInfo.InvariantCulture);
    }

    // Only virtual so the tests can avoid real network access and count how many clients are created.
    protected virtual HttpClient CreateHttpClient() => new();
}
