namespace CodeSmells.CsharpSpecific.RegionAbuse.Refactored;

public sealed record RegistrationResult(bool Success, string Message, decimal WelcomeDiscount);

// REFACTOR: Extract Class. Each former #region becomes a small type with one responsibility; no folding
//           is needed because every file/type is short enough to be read in full.
public class CustomerRepository
{
    private readonly Dictionary<string, string> _customersByEmail = new();
    public bool Exists(string email) => _customersByEmail.ContainsKey(email);
    public void Save(string email, string name) => _customersByEmail[email] = name;
}

public class CustomerValidator(CustomerRepository repository)
{
    public string? Validate(string name, string email)
    {
        if (string.IsNullOrWhiteSpace(name)) return "Name is required";
        if (!email.Contains('@')) return "Invalid email";
        if (repository.Exists(email)) return "Email already registered";
        return null;
    }
}

public static class WelcomeDiscountPolicy
{
    public static decimal For(string country) => country switch
    {
        "ES" => 0.10m,
        "PT" => 0.05m,
        _ => 0m,
    };
}

public class WelcomeMailer
{
    private readonly List<string> _sentEmails = new();
    public IReadOnlyList<string> SentEmails => _sentEmails;
    public void Send(string email, decimal discount) => _sentEmails.Add($"{email}: welcome! discount {discount:P0}");
}

// REFACTOR: what remains is a short use case that orchestrates the pieces.
public class RegisterCustomer(CustomerRepository repository, CustomerValidator validator, WelcomeMailer mailer)
{
    public RegistrationResult Handle(string name, string email, string country)
    {
        var error = validator.Validate(name, email);
        if (error is not null) return new RegistrationResult(false, error, 0m);

        repository.Save(email, name);
        var discount = WelcomeDiscountPolicy.For(country);
        mailer.Send(email, discount);
        return new RegistrationResult(true, "Registered", discount);
    }
}
