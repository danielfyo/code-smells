namespace CodeSmells.Dispensables.ExcessiveComments.Smelly;

public sealed record Room(int Number, int Capacity, bool HasSeaView, decimal Rate);

public static class RoomSelector
{
    // SMELL: Comments as deodorant. The comments try to cover up cryptic code instead of fixing
    // it: one-letter names, magic numbers and opaque conditions.
    public static Room? Pick(List<Room> r, int g, bool s)
    {
        // loop over the rooms sorted by price from lowest to highest
        foreach (var x in r.OrderBy(x => x.Rate))
        {
            // check that the guests (g) fit and that, if the customer wants a sea view (s),
            // the room has one; also rooms on floor 13 (numbers 1300-1399) are not offered
            // because they are being renovated
            if (x.Capacity >= g && (!s || x.HasSeaView) && !(x.Number >= 1300 && x.Number < 1400))
            {
                // return the first one that matches (the cheapest)
                return x;
            }
        }
        // if there is none we return null
        return null;
    }
}
