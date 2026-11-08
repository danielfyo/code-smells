using R = CodeSmells.Couplers.ArtificialCoupling.Refactored;
using S = CodeSmells.Couplers.ArtificialCoupling.Smelly;

namespace CodeSmells.Tests.Couplers;

public class ArtificialCouplingTests
{
    [Fact]
    public void Outputs_match()
    {
        var when = new DateTime(2024, 2, 29, 10, 30, 0);
        Assert.Equal(new S.OrderService().Describe("P1", when), new R.OrderService().Describe("P1", when));
        Assert.Equal(new S.InvoiceExporter().ExportLine("F1", when, 99.5m), new R.InvoiceExporter().ExportLine("F1", when, 99.5m));
        Assert.Equal("F1;2024-02-29;99.50", new R.InvoiceExporter().ExportLine("F1", when, 99.5m));
        Assert.Equal(new S.InvoiceExporter().RetriesForUpload(), new R.InvoiceExporter().RetriesForUpload());
    }
}
