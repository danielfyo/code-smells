using R = CodeSmells.General.ObviousBehaviorUnimplemented.Refactored;
using S = CodeSmells.General.ObviousBehaviorUnimplemented.Smelly;

namespace CodeSmells.Tests.General;

public class ObviousBehaviorUnimplementedTests
{
    [Fact]
    public void Both_parse_canonical_names()
    {
        Assert.Equal(DayOfWeek.Monday, S.DayParser.ParseDay("Monday"));
        Assert.Equal(DayOfWeek.Monday, R.DayParser.ParseDay("Monday"));
    }

    [Theory]
    [InlineData("monday")]
    [InlineData("MONDAY")]
    [InlineData("Mon")]
    [InlineData(" monday ")]
    public void Only_refactored_accepts_obvious_variants(string input)
    {
        Assert.Throws<FormatException>(() => S.DayParser.ParseDay(input));
        Assert.Equal(DayOfWeek.Monday, R.DayParser.ParseDay(input));
    }

    [Fact]
    public void Both_reject_garbage()
    {
        Assert.Throws<FormatException>(() => S.DayParser.ParseDay("Funday"));
        Assert.Throws<FormatException>(() => R.DayParser.ParseDay("Funday"));
    }
}
