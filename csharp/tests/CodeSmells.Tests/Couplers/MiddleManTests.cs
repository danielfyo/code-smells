using R = CodeSmells.Couplers.MiddleMan.Refactored;
using S = CodeSmells.Couplers.MiddleMan.Smelly;

namespace CodeSmells.Tests.Couplers;

public class MiddleManTests
{
    [Fact]
    public void Direct_use_of_the_book_behaves_like_the_middle_man()
    {
        var day = new DateOnly(2024, 12, 24);
        var s = new S.RestaurantReservations();
        var r = new R.ReservationBook();
        foreach (var (id, seats) in new[] { ("r1", 4), ("r2", 2), ("r3", 6) })
        {
            s.Add(new S.Reservation(id, "G", day, seats));
            r.Add(new R.Reservation(id, "G", day, seats));
        }
        Assert.Equal(s.Cancel("r2"), r.Cancel("r2"));
        Assert.Equal(s.Cancel("nope"), r.Cancel("nope"));
        Assert.Equal(s.SeatsOn(day), r.SeatsOn(day));
        Assert.Equal(s.Find("r1")?.Seats, r.Find("r1")?.Seats);
    }
}
