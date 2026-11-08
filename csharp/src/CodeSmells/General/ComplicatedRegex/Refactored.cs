using System.Text.RegularExpressions;

namespace CodeSmells.General.ComplicatedRegex.Refactored;

public static partial class PasswordPolicy
{
    // REFACTOR: Decompose Regex: each business rule is a named check. They can be changed
    //           independently and also let us tell the user WHICH rule is broken.
    private static readonly (string Rule, Func<string, bool> Check)[] Rules =
    {
        ("8 to 64 characters", p => p.Length is >= 8 and <= 64),
        ("a lowercase letter", p => p.Any(char.IsLower)),
        ("an uppercase letter", p => p.Any(char.IsUpper)),
        ("a digit", p => p.Any(char.IsDigit)),
        ("a symbol", p => p.Any(c => !char.IsLetterOrDigit(c) && c != '_' && !char.IsWhiteSpace(c))),
        ("no whitespace", p => !p.Any(char.IsWhiteSpace)),
        ("no character repeated 3 times in a row", p => !TripleRepeat().IsMatch(p)),
    };

    public static IReadOnlyList<string> BrokenRules(string password) =>
        Rules.Where(r => !r.Check(password)).Select(r => r.Rule).ToList();

    public static bool IsAcceptable(string password) => BrokenRules(password).Count == 0;

    [GeneratedRegex(@"(.)\1\1")]
    private static partial Regex TripleRepeat();

    // REFACTOR: when a regex is the right tool, write it in extended mode (x) with comments
    //           and generate it at compile time with [GeneratedRegex].
    [GeneratedRegex("""
        ^
        (?:ORD|RET)        # type: order or return
        -(?:19|20)\d\d     # four-digit year
        -(?!0{6})\d{6}     # 6-digit sequence number, other than 000000
        -(?:ES|PT|FR)      # billing country
        $
        """, RegexOptions.IgnorePatternWhitespace)]
    private static partial Regex OrderCodePattern();

    public static bool IsOrderCode(string code) => OrderCodePattern().IsMatch(code);
}
