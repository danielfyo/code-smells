using System.Security.Cryptography;
using System.Text;

namespace CodeSmells.Functions.MixedAbstractionLevels.Refactored;

public sealed record User(string Email, string PasswordHash);

public sealed class RegistrationService
{
    public Dictionary<string, User> Users { get; } = new();
    public List<string> Outbox { get; } = new();

    // REFACTOR: Extract Method (Compose Method, "Stepdown rule"). The public method only speaks
    // in business terms; the details go one level down into named methods.
    public void Register(string email, string password)
    {
        var normalized = NormalizeEmail(email);
        EnsureStrong(password);
        EnsureNotRegistered(normalized);
        Users[normalized] = new User(normalized, HashPassword(normalized, password));
        SendWelcome(normalized);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static void EnsureStrong(string password)
    {
        if (password.Length < 8 || !password.Any(char.IsDigit))
        {
            throw new ArgumentException("Weak password");
        }
    }

    private void EnsureNotRegistered(string email)
    {
        if (Users.ContainsKey(email))
        {
            throw new InvalidOperationException("Email already registered");
        }
    }

    private static string HashPassword(string email, string password) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes($"{email}:{password}"))).ToLowerInvariant();

    private void SendWelcome(string email) => Outbox.Add($"to={email};subject=Welcome");
}
