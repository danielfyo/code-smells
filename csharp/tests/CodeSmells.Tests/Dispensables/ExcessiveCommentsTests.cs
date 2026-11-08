using R = CodeSmells.Dispensables.ExcessiveComments.Refactored;
using S = CodeSmells.Dispensables.ExcessiveComments.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class ExcessiveCommentsTests
{
    private static readonly (int, int, bool, decimal)[] Rooms =
        [(1301, 4, true, 50m), (204, 2, false, 70m), (512, 4, true, 120m), (310, 4, false, 90m)];

    [Theory]
    [InlineData(2, false)]
    [InlineData(3, false)]
    [InlineData(3, true)]
    [InlineData(6, false)]
    public void Both_pick_the_same_room(int guests, bool seaView)
    {
        var s = S.RoomSelector.Pick(Rooms.Select(r => new S.Room(r.Item1, r.Item2, r.Item3, r.Item4)).ToList(), guests, seaView);
        var r = R.RoomSelector.CheapestAvailable(Rooms.Select(r => new R.Room(r.Item1, r.Item2, r.Item3, r.Item4)), guests, seaView);
        Assert.Equal(s?.Number, r?.Number);
    }
}
