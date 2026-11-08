namespace CodeSmells.ErrorHandling.OverriddenSafeties.Smelly;

public sealed record EmployeeRecord(string? Id, string? Email, string? Manager);

public static class DirectoryImporter
{
    // SMELL: Overridden Safeties. Nullability warnings are disabled with #pragma and the '!'
    // operator so that it "compiles clean". The compiler was warning that Email and Manager may
    // be null; instead of handling it, the warning is silenced and the failure shows up in
    // production. (In real life this often comes with tests marked Skip "because they fail".)
#pragma warning disable CS8602, CS8604
    public static string ToDirectoryEntry(EmployeeRecord record)
    {
        var email = record.Email!.Trim().ToLowerInvariant();
        var domain = email.Split('@')[1];
        return $"{record.Id}|{email}|{domain}|{record.Manager!.ToUpperInvariant()}";
    }
#pragma warning restore CS8602, CS8604
}
