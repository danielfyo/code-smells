using R = CodeSmells.CsharpSpecific.DatetimeNowDependency.Refactored;
using S = CodeSmells.CsharpSpecific.DatetimeNowDependency.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class DatetimeNowDependencyTests
{
    private sealed class FakeTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
        public override TimeZoneInfo LocalTimeZone => TimeZoneInfo.Utc;
    }

    private static R.HappyHourPricing At(int hour, int minute = 0) =>
        new(new FakeTimeProvider(new DateTimeOffset(2024, 6, 1, hour, minute, 0, TimeSpan.Zero)));

    [Fact]
    public void Smelly_result_depends_on_when_the_test_runs()
    {
        var price = new S.HappyHourPricing().PriceFor(100m);

        // The best we can do is accept either outcome: the discount rule itself is never really verified.
        Assert.Contains(price, new[] { 80m, 100m });
    }

    [Theory]
    [InlineData(16, 59, 100)]
    [InlineData(17, 0, 80)]
    [InlineData(18, 59, 80)]
    [InlineData(19, 0, 100)]
    public void Refactored_is_deterministic_at_every_boundary(int hour, int minute, decimal expected) =>
        Assert.Equal(expected, At(hour, minute).PriceFor(100m));

    [Fact]
    public void Refactored_with_the_system_clock_matches_the_smelly_version()
    {
        var smelly = new S.HappyHourPricing();
        var refactored = new R.HappyHourPricing(TimeProvider.System);

        Assert.Equal(smelly.IsHappyHourNow(), refactored.IsHappyHourNow());
    }
}
