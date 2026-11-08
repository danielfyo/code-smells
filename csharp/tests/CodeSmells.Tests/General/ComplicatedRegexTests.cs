using S = CodeSmells.General.ComplicatedRegex.Smelly;
using R = CodeSmells.General.ComplicatedRegex.Refactored;

namespace CodeSmells.Tests.General;

public class ComplicatedRegexTests
{
    [Theory]
    [InlineData("Str0ng!Pass", true)]
    [InlineData("weak", false)]
    [InlineData("nouppercase1!", false)]
    [InlineData("NoDigits!!x", false)]
    [InlineData("NoSymbol123", false)]
    [InlineData("Has Space1!", false)]
    [InlineData("Paaa55word!", false)]
    public void Both_policies_agree(string password, bool expected)
    {
        Assert.Equal(expected, S.PasswordPolicy.IsAcceptable(password));
        Assert.Equal(expected, R.PasswordPolicy.IsAcceptable(password));
    }

    [Fact]
    public void Refactored_policy_explains_what_is_wrong()
    {
        Assert.Equal(new[] { "an uppercase letter", "a symbol" }, R.PasswordPolicy.BrokenRules("lowercase123"));
    }

    [Theory]
    [InlineData("ORD-2024-000123-ES", true)]
    [InlineData("RET-1999-999999-FR", true)]
    [InlineData("ORD-2024-000000-ES", false)]
    [InlineData("ORD-2124-000123-ES", false)]
    [InlineData("ORD-2024-000123-DE", false)]
    public void Order_codes_match(string code, bool expected)
    {
        Assert.Equal(expected, S.PasswordPolicy.IsOrderCode(code));
        Assert.Equal(expected, R.PasswordPolicy.IsOrderCode(code));
    }
}
