using CodeSmells.CsharpSpecific.MagicConfigStrings.Refactored;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using R = CodeSmells.CsharpSpecific.MagicConfigStrings.Refactored;
using S = CodeSmells.CsharpSpecific.MagicConfigStrings.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class MagicConfigStringsTests
{
    private static IConfiguration Config(params (string Key, string Value)[] values) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(values.Select(v => new KeyValuePair<string, string?>(v.Key, v.Value)))
            .Build();

    private static readonly (string, string)[] ValidSettings =
    {
        ("Smtp:Host", "smtp.shop.invalid"),
        ("Smtp:Port", "587"),
        ("Smtp:UseSsl", "true"),
        ("Smtp:FromAddress", "orders@shop.invalid"),
    };

    private static R.SmtpSettingsReader Refactored(IConfiguration configuration) =>
        new ServiceCollection().AddSmtp(configuration).BuildServiceProvider().GetRequiredService<R.SmtpSettingsReader>();

    [Fact]
    public void Both_describe_the_server_identically()
    {
        var configuration = Config(ValidSettings);

        Assert.Equal("smtp.shop.invalid:587 (ssl=True)", new S.SmtpSettingsReader(configuration).Describe());
        Assert.Equal(new S.SmtpSettingsReader(configuration).Describe(), Refactored(configuration).Describe());
    }

    [Fact]
    public void Smelly_typo_in_a_key_silently_falls_back_to_a_default()
    {
        var configuration = Config(ValidSettings);

        Assert.Equal("noreply@shop.invalid", new S.SmtpSettingsReader(configuration).Sender()); // wrong sender!
        Assert.Equal("orders@shop.invalid", Refactored(configuration).Sender());
    }

    [Fact]
    public void Refactored_reports_invalid_configuration_with_a_clear_error()
    {
        var configuration = Config(("Smtp:Port", "587"));

        Assert.Throws<ArgumentNullException>(() => new S.SmtpSettingsReader(Config()).Describe()); // obscure failure
        var ex = Assert.Throws<OptionsValidationException>(() => Refactored(configuration));
        Assert.Contains("Smtp:Host is required", ex.Message);
    }
}
