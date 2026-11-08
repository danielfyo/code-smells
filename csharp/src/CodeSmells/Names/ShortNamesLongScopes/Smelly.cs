namespace CodeSmells.Names.ShortNamesLongScopes.Smelly;

public class RoomBookingService
{
    // SMELL: long-lived fields (the whole lifetime of the object) with one-letter names.
    //        Anywhere in the class you have to remember what "r", "b" or "m" were.
    private readonly Dictionary<string, int> r = new();   // capacity per room
    private readonly List<(string, DateOnly, int)> b = new(); // bookings
    private readonly int m;                                // max bookings per day

    public RoomBookingService(int m) => this.m = m;

    public void AddRoom(string n, int c) => r[n] = c;

    public bool Book(string n, DateOnly d, int p)
    {
        // SMELL: n, d, p, c, t... live through the whole method and force the reader to keep a mental map.
        if (!r.TryGetValue(n, out var c) || p > c)
        {
            return false;
        }

        var t = b.Count(x => x.Item2 == d);
        if (t >= m)
        {
            return false;
        }

        if (b.Any(x => x.Item1 == n && x.Item2 == d))
        {
            return false;
        }

        b.Add((n, d, p));
        return true;
    }

    public int BookingsOn(DateOnly d) => b.Count(x => x.Item2 == d);
}
