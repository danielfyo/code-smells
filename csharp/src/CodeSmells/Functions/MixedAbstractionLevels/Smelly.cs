using System.Security.Cryptography;
using System.Text;

namespace CodeSmells.Functions.MixedAbstractionLevels.Smelly;

public sealed record User(string Email, string PasswordHash);

public sealed class RegistrationService
{
    public Dictionary<string, User> Users { get; } = new();
    public List<string> Outbox { get; } = new();

    // SMELL: Mixed Levels of Abstraction. High-level business steps ("register", "send
    // welcome") live next to low-level details: looping over characters, hashing byte by byte,
    // building hex strings... The reader jumps between levels on every line.
    public void Register(string email, string password)
    {
        email = email.Trim().ToLowerInvariant();
        bool hasDigit = false;
        foreach (var ch in password)
            if (char.IsDigit(ch)) { hasDigit = true; break; }
        if (password.Length < 8 || !hasDigit) throw new ArgumentException("Weak password");
        if (Users.ContainsKey(email)) throw new InvalidOperationException("Email already registered");

        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(email + ":" + password));
        var sb = new StringBuilder();
        foreach (var b in bytes) sb.Append(b.ToString("x2"));

        Users[email] = new User(email, sb.ToString());
        Outbox.Add($"to={email};subject=Welcome");
    }
}
