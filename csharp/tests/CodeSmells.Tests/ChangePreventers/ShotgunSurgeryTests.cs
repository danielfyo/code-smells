using S = CodeSmells.ChangePreventers.ShotgunSurgery.Smelly;
using R = CodeSmells.ChangePreventers.ShotgunSurgery.Refactored;

namespace CodeSmells.Tests.ChangePreventers;

public class ShotgunSurgeryTests
{
    [Fact]
    public void Cart_invoice_and_receipt_agree()
    {
        var sItems = new[] { new S.Product("Bread", 2m, true), new S.Product("Frying pan", 30m, false) };
        var rItems = new[] { new R.Product("Bread", 2m, true), new R.Product("Frying pan", 30m, false) };

        var sCart = new S.Cart(); sCart.Items.AddRange(sItems);
        var rCart = new R.Cart(); rCart.Items.AddRange(rItems);

        Assert.Equal(sCart.Total(), rCart.Total());
        Assert.Equal(new S.InvoiceBuilder().TaxAmount(sItems), new R.InvoiceBuilder().TaxAmount(rItems));
        for (var i = 0; i < sItems.Length; i++)
            Assert.Equal(new S.ReceiptPrinter().Line(sItems[i]), new R.ReceiptPrinter().Line(rItems[i]));
    }
}
