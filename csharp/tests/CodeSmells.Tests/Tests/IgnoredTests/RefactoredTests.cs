using CodeSmells.Tests.IgnoredTests;

namespace CodeSmells.Tests.Tests.IgnoredTests;

// REFACTOR: instead of ignoring the test, its root cause (dependency on the real clock) is fixed by
//           controlling time. If a test must be disabled temporarily, Skip must state the concrete
//           reason and a ticket, and be reviewed every iteration.
public class RefactoredTests
{
    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
        public override TimeZoneInfo LocalTimeZone => TimeZoneInfo.Utc;
    }

    private static CouponService ServiceOn(int year, int month, int day) =>
        new(new FixedClock(new DateTimeOffset(year, month, day, 12, 0, 0, TimeSpan.Zero)));

    [Fact]
    public void Welcome_coupon_gives_ten_percent() =>
        Assert.Equal(90m, ServiceOn(2024, 1, 1).Apply("WELCOME10", 100m));

    [Fact]
    public void Summer_coupon_gives_twenty_percent_before_it_expires() =>
        Assert.Equal(80m, ServiceOn(2024, 8, 31).Apply("SUMMER24", 100m));

    [Fact]
    public void Summer_coupon_has_no_effect_after_it_expires() =>
        Assert.Equal(100m, ServiceOn(2024, 9, 1).Apply("SUMMER24", 100m));
}
