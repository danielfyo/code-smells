using System.Text.RegularExpressions;

namespace CodeSmells.General.ComplicatedRegex.Smelly;

public static class PasswordPolicy
{
    // SMELL: a cryptic one-line regex, with no name or explanation, mixing several rules.
    //        What if the business asks for at least 10 characters? And why does a given password fail?
    public static bool IsAcceptable(string password) =>
        Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?!.*\s)(?!.*(.)\1\1).{8,64}$");

    // SMELL: and another one for order codes: what does each group mean?
    public static bool IsOrderCode(string code) =>
        Regex.IsMatch(code, @"^(?:ORD|RET)-(?:19|20)\d\d-(?!0{6})\d{6}-(?:ES|PT|FR)$");
}
