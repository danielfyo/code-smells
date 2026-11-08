using S = CodeSmells.Data.StatusVariable.Smelly;
using R = CodeSmells.Data.StatusVariable.Refactored;

namespace CodeSmells.Tests.Data;

public class StatusVariableTests
{
    private static readonly (char, int, bool, bool)[] Seats =
        [('A', 1, true, true), ('A', 2, false, false), ('B', 1, false, true), ('B', 2, false, false)];

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Same_seat_found(bool accessible)
    {
        var s = S.SeatFinder.FirstFree(Seats.Select(x => new S.Seat(x.Item1, x.Item2, x.Item3, x.Item4)).ToList(), accessible);
        var r = R.SeatFinder.FirstFree(Seats.Select(x => new R.Seat(x.Item1, x.Item2, x.Item3, x.Item4)), accessible);
        Assert.Equal((s?.Row, s?.Number), (r?.Row, r?.Number));
    }

    [Fact]
    public void Both_return_null_when_full()
    {
        Assert.Null(S.SeatFinder.FirstFree([new('A', 1, true, true)], false));
        Assert.Null(R.SeatFinder.FirstFree([new('A', 1, true, true)], false));
    }
}
