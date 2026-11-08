using Microsoft.Extensions.Configuration;

namespace CodeSmells.CsharpSpecific.MagicConfigStrings.Smelly;

public class SmtpSettingsReader(IConfiguration configuration)
{
    // SMELL: configuration read with string keys scattered around the code. Every reader repeats the key
    //        and the parsing; a typo ("Smtp:From" instead of "Smtp:FromAddress") silently returns null and
    //        falls back to a default; missing values blow up with obscure exceptions at first use instead
    //        of at startup.
    public string Describe()
    {
        var host = configuration["Smtp:Host"];
        var port = int.Parse(configuration["Smtp:Port"]!);
        var useSsl = bool.Parse(configuration["Smtp:UseSsl"] ?? "false");
        return $"{host}:{port} (ssl={useSsl})";
    }

    public string Sender() => configuration["Smtp:From"] ?? "noreply@shop.invalid";
}
