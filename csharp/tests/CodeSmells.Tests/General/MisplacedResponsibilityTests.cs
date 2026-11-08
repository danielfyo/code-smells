using R = CodeSmells.General.MisplacedResponsibility.Refactored;
using S = CodeSmells.General.MisplacedResponsibility.Smelly;

namespace CodeSmells.Tests.General;

public class MisplacedResponsibilityTests
{
    [Theory]
    [InlineData(false, 300, 2)]
    [InlineData(true, 300, 2)]
    [InlineData(true, 100, 2)]
    public void Both_printers_produce_the_same_output(bool wholesale, decimal price, int quantity)
    {
        var smelly = new S.Invoice { IsWholesaleCustomer = wholesale };
        smelly.Lines.Add(new S.InvoiceLine("Desk", price, quantity));
        var refactored = new R.Invoice { IsWholesaleCustomer = wholesale };
        refactored.Lines.Add(new R.InvoiceLine("Desk", price, quantity));

        Assert.Equal(new S.InvoicePrinter().Print(smelly), new R.InvoicePrinter().Print(refactored));
    }

    [Fact]
    public void Refactored_total_is_available_without_printing()
    {
        var invoice = new R.Invoice { IsWholesaleCustomer = true };
        invoice.Lines.Add(new R.InvoiceLine("Desk", 300m, 2));

        Assert.Equal(689.70m, invoice.Total);
    }
}
