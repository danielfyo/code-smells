using S = CodeSmells.Bloaters.LongParameterList.Smelly;
using R = CodeSmells.Bloaters.LongParameterList.Refactored;

namespace CodeSmells.Tests.Bloaters;

public class LongParameterListTests
{
    private static readonly DateOnly In = new(2024, 7, 1);
    private static readonly DateOnly Out = new(2024, 7, 4);

    [Fact]
    public void Both_versions_quote_the_same()
    {
        var smelly = new S.HotelBookingService().Quote("MAD01", In, Out, 2, 1, 1, 100m, true, "SUMMER10");
        var request = new R.BookingRequest("MAD01", new R.Stay(In, Out), new R.Guests(2, 1),
            BreakfastIncluded: true, PromoCode: "SUMMER10");
        var refactored = new R.HotelBookingService().Quote(request, 100m);
        Assert.Equal(smelly, refactored);
        Assert.Equal(351.00m, refactored);
    }

    [Fact]
    public void Swapped_dates_compile_in_smelly_and_fail_at_runtime_in_both()
    {
        // In the smelly version swapping the dates only fails when Quote runs;
        // in the refactored one it fails as soon as the Stay object is built.
        Assert.Throws<ArgumentException>(() => new S.HotelBookingService().Quote("X", Out, In, 1, 0, 1, 50m, false, ""));
        Assert.Throws<ArgumentException>(() => new R.Stay(Out, In));
    }
}
