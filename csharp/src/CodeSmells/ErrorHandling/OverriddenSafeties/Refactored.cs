namespace CodeSmells.ErrorHandling.OverriddenSafeties.Refactored;

public sealed record EmployeeRecord(string? Id, string? Email, string? Manager);

// REFACTOR: Respect the safeties. Listen to the compiler: optional data is validated at the
// boundary and an explicit result is returned instead of silencing the warning.
public abstract record ImportResult
{
    public sealed record Ok(string Entry) : ImportResult;
    public sealed record Invalid(string Reason) : ImportResult;
}

public static class DirectoryImporter
{
    private const string NoManager = "-";

    public static ImportResult ToDirectoryEntry(EmployeeRecord record)
    {
        if (string.IsNullOrWhiteSpace(record.Id))
        {
            return new ImportResult.Invalid("Missing Id");
        }

        if (record.Email is not { } rawEmail)
        {
            return new ImportResult.Invalid($"{record.Id}: missing email");
        }

        var email = rawEmail.Trim().ToLowerInvariant();
        var at = email.IndexOf('@');
        if (at < 0)
        {
            return new ImportResult.Invalid($"{record.Id}: email without domain");
        }

        var manager = record.Manager?.ToUpperInvariant() ?? NoManager; // the CEO has no manager
        return new ImportResult.Ok($"{record.Id}|{email}|{email[(at + 1)..]}|{manager}");
    }
}
