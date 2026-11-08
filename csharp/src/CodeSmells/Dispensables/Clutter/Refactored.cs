namespace CodeSmells.Dispensables.Clutter.Refactored;

// REFACTOR: Remove Dead Code / Inline Variable / Simplify Conditional. Usings, the empty
// constructor, unused fields and redundant comparisons are removed; the logic fits in two lines.
public sealed class CouponValidator
{
    public bool IsValid(string code, DateOnly expiresOn, DateOnly today) =>
        today <= expiresOn && HasValidFormat(code);

    private static bool HasValidFormat(string code) => code.Length == 8 && code.All(char.IsLetterOrDigit);
}
