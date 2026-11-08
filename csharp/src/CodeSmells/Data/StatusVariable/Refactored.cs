namespace CodeSmells.Data.StatusVariable.Refactored;

public sealed record Seat(char Row, int Number, bool IsTaken, bool IsAccessible)
{
    public bool Suits(bool needsAccessible) => !IsTaken && (IsAccessible || !needsAccessible);
}

public static class SeatFinder
{
    // REFACTOR: Replace Control Flag with Break/Return (here, with LINQ). The flow is defined by
    // the expression itself: return the first one that fits.
    public static Seat? FirstFree(IEnumerable<Seat> seats, bool needsAccessible) =>
        seats.FirstOrDefault(seat => seat.Suits(needsAccessible));
}
