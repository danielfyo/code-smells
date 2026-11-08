namespace CodeSmells.Data.StatusVariable.Smelly;

public sealed record Seat(char Row, int Number, bool IsTaken, bool IsAccessible);

public static class SeatFinder
{
    // SMELL: Status Variable. The 'found' and 'keepSearching' flags drive the loop's flow;
    // the reader must track their values mentally on every iteration to know what happens.
    public static Seat? FirstFree(IReadOnlyList<Seat> seats, bool needsAccessible)
    {
        Seat? result = null;
        bool found = false;
        bool keepSearching = true;
        int i = 0;
        while (keepSearching && i < seats.Count)
        {
            var seat = seats[i];
            if (!seat.IsTaken)
            {
                if (!needsAccessible || seat.IsAccessible)
                {
                    result = seat;
                    found = true;
                }
            }
            if (found) keepSearching = false;
            i++;
        }
        return found ? result : null;
    }
}
