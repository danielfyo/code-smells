using System.Globalization;
using S = CodeSmells.CsharpSpecific.StaticMutableState.Smelly;
using R = CodeSmells.CsharpSpecific.StaticMutableState.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class StaticMutableStateTests
{
    [Fact]
    public void Smelly_instances_share_one_hidden_counter()
    {
        var spain = new S.InvoiceNumberGenerator("ES");
        var portugal = new S.InvoiceNumberGenerator("PT");

        var first = int.Parse(spain.Next()[3..], CultureInfo.InvariantCulture);
        var second = int.Parse(portugal.Next()[3..], CultureInfo.InvariantCulture);

        Assert.Equal(first + 1, second); // Portugal "inherits" Spain's sequence
    }

    [Fact]
    public void Refactored_instances_are_independent()
    {
        var spain = new R.InvoiceNumberGenerator("ES");
        var portugal = new R.InvoiceNumberGenerator("PT");

        Assert.Equal("ES-00001", spain.Next());
        Assert.Equal("PT-00001", portugal.Next());
    }

    [Fact]
    public void Refactored_is_safe_under_concurrency()
    {
        var generator = new R.InvoiceNumberGenerator("ES");

        Parallel.For(0, 1000, _ => generator.Next());

        Assert.Equal(1000, generator.Issued.Distinct().Count());
    }
}
