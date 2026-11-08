using R = CodeSmells.OoAbusers.BaseClassDependsOnSubclass.Refactored;
using S = CodeSmells.OoAbusers.BaseClassDependsOnSubclass.Smelly;

namespace CodeSmells.Tests.OoAbusers;

public class BaseClassDependsOnSubclassTests
{
    [Fact]
    public void Costs_and_days_match_for_every_subclass()
    {
        (S.Shipment s, R.Shipment r)[] pairs =
        [
            (new S.StandardShipment { WeightKg = 3m }, new R.StandardShipment(3m)),
            (new S.ExpressShipment { WeightKg = 3m }, new R.ExpressShipment(3m)),
            (new S.InternationalShipment { WeightKg = 3m, CustomsFee = 15m }, new R.InternationalShipment(3m, 15m)),
        ];
        foreach (var (s, r) in pairs)
        {
            Assert.Equal(s.Cost(), r.Cost());
            Assert.Equal(s.EstimatedDays(), r.EstimatedDays());
        }
    }
}
