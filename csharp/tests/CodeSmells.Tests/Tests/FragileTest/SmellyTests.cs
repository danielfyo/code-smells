using System.Reflection;
using CodeSmells.Tests.FragileTest;

namespace CodeSmells.Tests.Tests.FragileTest;

public class SmellyTests
{
    // SMELL: the test uses reflection to invoke a PRIVATE method and read a PRIVATE field.
    //        Renaming ApplyVolumeDiscount, replacing the list with an enum or merging the steps
    //        (refactorings that do not change behaviour) breaks this test.
    [Fact]
    public void Volume_discount_internals()
    {
        var calculator = new PriceCalculator();
        var method = typeof(PriceCalculator).GetMethod("ApplyVolumeDiscount", BindingFlags.NonPublic | BindingFlags.Instance)!;

        var discounted = (decimal)method.Invoke(calculator, new object[] { 100m, 10 })!;

        var rules = (List<string>)typeof(PriceCalculator)
            .GetField("_appliedRules", BindingFlags.NonPublic | BindingFlags.Instance)!
            .GetValue(calculator)!;
        Assert.Equal(90m, discounted);
        Assert.Equal(new[] { "volume" }, rules);
    }
}
