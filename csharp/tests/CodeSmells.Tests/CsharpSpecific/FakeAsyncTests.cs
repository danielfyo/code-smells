using System.Text;
using R = CodeSmells.CsharpSpecific.FakeAsync.Refactored;
using S = CodeSmells.CsharpSpecific.FakeAsync.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class FakeAsyncTests
{
    [Fact]
    public async Task Tax_calculation_is_the_same()
    {
        var smelly = await new S.InvoiceLibrary().CalculateTaxAsync(new[] { new S.InvoiceLine(100m, "food"), new S.InvoiceLine(100m, "tech") });
        var refactored = new R.InvoiceLibrary().CalculateTax(new[] { new R.InvoiceLine(100m, "food"), new R.InvoiceLine(100m, "tech") });

        Assert.Equal(31m, smelly);
        Assert.Equal(smelly, refactored);
    }

    [Fact]
    public async Task Template_reading_is_the_same()
    {
        var bytes = Encoding.UTF8.GetBytes("Dear {{customer}}");

        var smelly = await new S.InvoiceLibrary().ReadTemplateAsync(new MemoryStream(bytes));
        var refactored = await new R.InvoiceLibrary().ReadTemplateAsync(new MemoryStream(bytes));

        Assert.Equal("Dear {{customer}}", smelly);
        Assert.Equal(smelly, refactored);
    }

    [Fact]
    public void Refactored_cpu_bound_api_is_honestly_synchronous()
    {
        var method = typeof(R.InvoiceLibrary).GetMethod(nameof(R.InvoiceLibrary.CalculateTax))!;

        Assert.Equal(typeof(decimal), method.ReturnType);
    }
}
