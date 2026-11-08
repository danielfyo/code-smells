using S = CodeSmells.OoAbusers.InappropriateStatic.Smelly;
using R = CodeSmells.OoAbusers.InappropriateStatic.Refactored;

namespace CodeSmells.Tests.OoAbusers;

public class InappropriateStaticTests
{
    [Fact]
    public void Smelly_can_only_be_tested_relative_to_the_real_clock()
    {
        // With the static we can only build dates relative to DateTime.Now and hope for the best.
        var farAway = new S.Booking("B1", DateTime.Now.AddDays(10), 100m);
        Assert.Equal(0m, new S.BookingService().Cancel(farAway));
        var refactored = new R.BookingService(new R.StandardCancellationPolicy(), new R.SystemClock());
        Assert.Equal(0m, refactored.Cancel(new R.Booking("B1", DateTime.Now.AddDays(10), 100m)));
    }

    [Theory]
    [InlineData(72, 0)]
    [InlineData(30, 50)]
    [InlineData(5, 100)]
    public void Refactored_is_deterministic_with_a_fixed_clock(int hoursBefore, int expectedFee)
    {
        var now = new DateTime(2024, 5, 1, 12, 0, 0);
        var service = new R.BookingService(new R.StandardCancellationPolicy(), new R.FixedClock(now));
        Assert.Equal(expectedFee, service.Cancel(new R.Booking("B1", now.AddHours(hoursBefore), 100m)));
    }

    [Fact]
    public void Policy_can_be_swapped()
    {
        var now = new DateTime(2024, 5, 1, 12, 0, 0);
        var service = new R.BookingService(new R.FlexibleCancellationPolicy(), new R.FixedClock(now));
        Assert.Equal(0m, service.Cancel(new R.Booking("B1", now.AddHours(5), 100m)));
    }
}
