using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace CodeSmells.CsharpSpecific.MagicConfigStrings.Refactored;

// REFACTOR: Options pattern. A typed class describes the configuration section once; binding, parsing
//           and validation are done by the framework. Keys come from property names, so they cannot be
//           misspelled in one place only.
public sealed class SmtpOptions
{
    public const string SectionName = "Smtp";

    [Required] public string Host { get; set; } = "";
    [Range(1, 65535)] public int Port { get; set; } = 25;
    public bool UseSsl { get; set; }
    [Required, EmailAddress] public string FromAddress { get; set; } = "";
}

public static class SmtpServiceCollectionExtensions
{
    // REFACTOR: invalid configuration fails fast, with a clear message, when the options are first used
    //           (or at startup when combined with ValidateOnStart() in a hosted app).
    public static IServiceCollection AddSmtp(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<SmtpOptions>()
            .Bind(configuration.GetSection(SmtpOptions.SectionName))
            .Validate(o => !string.IsNullOrWhiteSpace(o.Host), "Smtp:Host is required")
            .Validate(o => o.FromAddress.Contains('@'), "Smtp:FromAddress must be an email address");
        services.AddTransient<SmtpSettingsReader>();
        return services;
    }
}

public class SmtpSettingsReader(IOptions<SmtpOptions> options)
{
    private readonly SmtpOptions _smtp = options.Value;

    public string Describe() => $"{_smtp.Host}:{_smtp.Port} (ssl={_smtp.UseSsl})";

    public string Sender() => _smtp.FromAddress;
}
