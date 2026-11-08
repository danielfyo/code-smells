using R = CodeSmells.Names.ShortNamesLongScopes.Refactored;
using S = CodeSmells.Names.ShortNamesLongScopes.Smelly;

namespace CodeSmells.Tests.Names;

public class ShortNamesLongScopesTests
{
    [Fact]
    public void Both_services_accept_and_reject_the_same_bookings()
    {
        var smelly = new S.RoomBookingService(2);
        var refactored = new R.RoomBookingService(2);
        foreach (var (room, capacity) in new[] { ("Atlas", 4), ("Boreal", 10), ("Cosmos", 6) })
        {
            smelly.AddRoom(room, capacity);
            refactored.AddRoom(room, capacity);
        }

        var day = new DateOnly(2024, 5, 10);
        var requests = new[]
        {
            ("Atlas", 3, true),   // fits
            ("Atlas", 2, false),  // already booked that day
            ("Boreal", 12, false),// exceeds capacity
            ("Ghost", 1, false),  // does not exist
            ("Boreal", 8, true),  // fits
            ("Cosmos", 2, false), // daily maximum reached
        };

        foreach (var (room, people, expected) in requests)
        {
            Assert.Equal(expected, smelly.Book(room, day, people));
            Assert.Equal(expected, refactored.Book(room, day, people));
        }

        Assert.Equal(smelly.BookingsOn(day), refactored.BookingsOn(day));
    }
}
