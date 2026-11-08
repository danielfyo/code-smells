namespace CodeSmells.CsharpSpecific.RegionAbuse.Smelly;

public sealed record RegistrationResult(bool Success, string Message, decimal WelcomeDiscount);

// SMELL: #region used to fold away a class that does far too much. The IDE shows a tidy list of collapsed
//        blocks, but behind them there are four responsibilities (validation, pricing, persistence,
//        notifications). Regions hide the problem instead of solving it: the class should be split.
public class CustomerManager
{
    #region Fields
    private readonly Dictionary<string, string> _customersByEmail = new();
    private readonly List<string> _sentEmails = new();
    public IReadOnlyList<string> SentEmails => _sentEmails;
    #endregion

    #region Public API
    public RegistrationResult Register(string name, string email, string country)
    {
        var error = Validate(name, email);
        if (error is not null) return new RegistrationResult(false, error, 0m);

        Save(email, name);
        var discount = WelcomeDiscount(country);
        SendWelcome(email, discount);
        return new RegistrationResult(true, "Registered", discount);
    }
    #endregion

    #region Validation
    private string? Validate(string name, string email)
    {
        if (string.IsNullOrWhiteSpace(name)) return "Name is required";
        if (!email.Contains('@')) return "Invalid email";
        if (_customersByEmail.ContainsKey(email)) return "Email already registered";
        return null;
    }
    #endregion

    #region Pricing
    private static decimal WelcomeDiscount(string country) => country switch
    {
        "ES" => 0.10m,
        "PT" => 0.05m,
        _ => 0m,
    };
    #endregion

    #region Persistence
    private void Save(string email, string name) => _customersByEmail[email] = name;
    #endregion

    #region Notifications
    private void SendWelcome(string email, decimal discount) =>
        _sentEmails.Add($"{email}: welcome! discount {discount:P0}");
    #endregion
}
