using S = CodeSmells.Couplers.MessageChains.Smelly;
using R = CodeSmells.Couplers.MessageChains.Refactored;

namespace CodeSmells.Tests.Couplers;

public class MessageChainsTests
{
    [Theory]
    [InlineData("ISLANDS", 5)]
    [InlineData("PENINSULA", 25)]
    [InlineData("PENINSULA", 2)]
    [InlineData("INTL", 2)]
    public void Courier_and_label_match(string zone, int kg)
    {
        var s = new S.Order
        {
            Id = "O1", WeightKg = kg,
            Customer = new S.Customer { Address = new S.Address { City = new S.City { Name = "Palma", Region = new S.Region { Name = "Baleares", ShippingZone = zone } } } },
        };
        var r = new R.Order("O1", new R.Customer("", new R.Address("", new R.City("Palma", new R.Region("Baleares", zone)))), kg);
        var sSel = new S.CourierSelector();
        var rSel = new R.CourierSelector();
        Assert.Equal(sSel.ChooseCourier(s), rSel.ChooseCourier(r));
        Assert.Equal(sSel.Label(s), rSel.Label(r));
    }
}
