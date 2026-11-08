using S = CodeSmells.General.OddballSolution.Smelly;
using R = CodeSmells.General.OddballSolution.Refactored;

namespace CodeSmells.Tests.General;

public class OddballSolutionTests
{
    [Fact]
    public void All_importers_agree_on_well_formed_dates()
    {
        const string raw = "07/03/2024";
        var expected = new DateOnly(2024, 3, 7);

        Assert.Equal(expected, new S.CustomerImporter().ParseSignupDate(raw));
        Assert.Equal(expected, new S.OrderImporter().ParseOrderDate(raw));
        Assert.Equal(expected, new S.InvoiceImporter().ParseInvoiceDate(raw));
        Assert.Equal(expected, new R.CustomerImporter().ParseSignupDate(raw));
        Assert.Equal(expected, new R.OrderImporter().ParseOrderDate(raw));
        Assert.Equal(expected, new R.InvoiceImporter().ParseInvoiceDate(raw));
    }

    [Fact]
    public void Smelly_importers_disagree_on_odd_input()
    {
        const string raw = "7/3/2024"; // no leading zeros

        Assert.Throws<FormatException>(() => new S.CustomerImporter().ParseSignupDate(raw));
        Assert.Equal(new DateOnly(2024, 3, 7), new S.OrderImporter().ParseOrderDate(raw));

        // With a single solution, every importer reacts the same way.
        Assert.Throws<FormatException>(() => new R.CustomerImporter().ParseSignupDate(raw));
        Assert.Throws<FormatException>(() => new R.OrderImporter().ParseOrderDate(raw));
    }
}
