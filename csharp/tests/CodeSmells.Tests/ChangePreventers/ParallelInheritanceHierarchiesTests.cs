using S = CodeSmells.ChangePreventers.ParallelInheritanceHierarchies.Smelly;
using R = CodeSmells.ChangePreventers.ParallelInheritanceHierarchies.Refactored;

namespace CodeSmells.Tests.ChangePreventers;

public class ParallelInheritanceHierarchiesTests
{
    [Fact]
    public void Premiums_match()
    {
        S.Vehicle car = new S.Car { Plate = "1234ABC", Value = 20000m, Seats = 5 };
        S.Vehicle truck = new S.Truck { Plate = "9876XYZ", Value = 80000m, PayloadTons = 12m };

        Assert.Equal(S.InsuranceFactory.For(car).AnnualPremium(car), new R.Car("1234ABC", 20000m, 5).AnnualPremium());
        Assert.Equal(S.InsuranceFactory.For(truck).AnnualPremium(truck), new R.Truck("9876XYZ", 80000m, 12m).AnnualPremium());
    }

    [Fact]
    public void Adding_a_type_in_smelly_fails_at_runtime_if_the_parallel_class_is_forgotten()
    {
        var bike = new UnregisteredBike { Plate = "M1", Value = 5000m };
        Assert.Throws<NotSupportedException>(() => S.InsuranceFactory.For(bike));
        Assert.Equal(200m, new R.Motorbike("M1", 5000m).AnnualPremium());
    }

    private sealed class UnregisteredBike : S.Vehicle { }
}
