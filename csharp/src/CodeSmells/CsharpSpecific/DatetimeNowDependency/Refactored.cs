namespace CodeSmells.CsharpSpecific.DatetimeNowDependency.Refactored;

// REFACTOR: the clock is an explicit dependency. .NET 8 ships TimeProvider: production code uses
//           TimeProvider.System and tests use a fake (e.g. FakeTimeProvider from
//           Microsoft.Extensions.TimeProvider.Testing, or a tiny hand-written stub).
public class HappyHourPricing(TimeProvider clock)
{
    private const decimal HappyHourMultiplier = 0.8m;

    public decimal PriceFor(decimal listPrice) =>
        IsHappyHourNow() ? listPrice * HappyHourMultiplier : listPrice;

    public bool IsHappyHourNow() => clock.GetLocalNow().Hour is >= 17 and < 19;
}
