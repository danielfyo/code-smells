using R = CodeSmells.ErrorHandling.ErrorCodes.Refactored;
using S = CodeSmells.ErrorHandling.ErrorCodes.Smelly;

namespace CodeSmells.Tests.ErrorHandling;

public class ErrorCodesTests
{
    [Fact]
    public void Both_describe_the_same_outcomes()
    {
        var s = new S.TicketOffice(); s.AddEvent("concert", 3);
        var r = new R.TicketOffice(); r.AddEvent("concert", 3);
        foreach (var (ev, qty) in new[] { ("concert", 2), ("concert", 2), ("opera", 1), ("concert", 0), ("concert", 1) })
        {
            Assert.Equal(S.BookingUi.Describe(s.Book(ev, qty)), R.BookingUi.Describe(r.Book(ev, qty)));
        }
    }

    [Fact]
    public void Error_code_can_be_mistaken_for_data()
    {
        var s = new S.TicketOffice(); s.AddEvent("concert", 1);
        var bookingNumber = s.Book("concert", 5); // the caller forgets to check
        Assert.Equal(-2, bookingNumber);          // and stores "-2" as a booking number

        var r = new R.TicketOffice(); r.AddEvent("concert", 1);
        var result = r.Book("concert", 5);
        Assert.IsType<R.BookingResult.SoldOut>(result);
        Assert.False(result is R.BookingResult.Booked);
    }
}
