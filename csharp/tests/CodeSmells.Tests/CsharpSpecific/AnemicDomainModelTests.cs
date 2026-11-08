using S = CodeSmells.CsharpSpecific.AnemicDomainModel.Smelly;
using R = CodeSmells.CsharpSpecific.AnemicDomainModel.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class AnemicDomainModelTests
{
    [Fact]
    public void Both_models_apply_the_same_rules()
    {
        var service = new S.OrderService();
        var smelly = new S.Order();
        var refactored = new R.Order();

        service.AddLine(smelly, "BOOK", 2, 20m);
        refactored.AddLine("BOOK", 2, 20m);
        service.Ship(smelly);
        refactored.Ship();

        Assert.Equal(40m, smelly.Total);
        Assert.Equal(smelly.Total, refactored.Total);
        Assert.Equal(smelly.Status, refactored.Status.ToString());
        Assert.Throws<InvalidOperationException>(() => service.AddLine(smelly, "PEN", 1, 1m));
        Assert.Throws<InvalidOperationException>(() => refactored.AddLine("PEN", 1, 1m));
    }

    [Fact]
    public void Smelly_entity_can_be_put_in_an_invalid_state()
    {
        var order = new S.Order { Status = "Shipped" }; // shipped with no lines, bypassing the service
        order.Lines.Add(new S.OrderLine { Sku = "PEN", Quantity = -3, UnitPrice = 1m });

        Assert.Equal(0m, order.Total); // Total out of sync with Lines
    }
}
