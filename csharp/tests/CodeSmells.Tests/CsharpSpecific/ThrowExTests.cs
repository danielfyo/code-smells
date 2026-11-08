using S = CodeSmells.CsharpSpecific.ThrowEx.Smelly;
using R = CodeSmells.CsharpSpecific.ThrowEx.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class ThrowExTests
{
    [Fact]
    public void Smelly_rethrow_loses_the_original_stack_frame()
    {
        var ex = Assert.Throws<FormatException>(() => new S.PaymentImporter().ImportAmount("12,5x"));

        Assert.DoesNotContain("ParseAmount", ex.StackTrace);
    }

    [Fact]
    public void Refactored_rethrow_keeps_the_original_stack_frame()
    {
        var ex = Assert.Throws<FormatException>(() => new R.PaymentImporter().ImportAmount("12,5x"));

        Assert.Contains("ParseAmount", ex.StackTrace);
    }

    [Fact]
    public void Both_log_and_parse_alike()
    {
        var smelly = new S.PaymentImporter();
        var refactored = new R.PaymentImporter();

        Assert.Equal(12.5m, smelly.ImportAmount("12.5"));
        Assert.Equal(12.5m, refactored.ImportAmount("12.5"));
        Assert.ThrowsAny<FormatException>(() => smelly.ImportAmount("bad"));
        Assert.ThrowsAny<FormatException>(() => refactored.ImportAmount("bad"));
        Assert.Equal(smelly.Log, refactored.Log);
    }
}
