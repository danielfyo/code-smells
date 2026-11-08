namespace CodeSmells.Dispensables.ExcessiveComments.Refactored;

public sealed record Room(int Number, int Capacity, bool HasSeaView, decimal Rate)
{
    private const int FloorUnderRenovation = 13;

    // REFACTOR: Extract Method / Introduce Explaining Variable. What the comment explained is now
    // said by the member's name.
    public int Floor => Number / 100;
    public bool IsUnderRenovation => Floor == FloorUnderRenovation;
    public bool Fits(int guests) => Capacity >= guests;
}

public static class RoomSelector
{
    // REFACTOR: Rename Variable. With good names the code explains itself and the redundant
    // comments are no longer needed.
    public static Room? CheapestAvailable(IEnumerable<Room> rooms, int guests, bool wantsSeaView) =>
        rooms.OrderBy(room => room.Rate)
             .FirstOrDefault(room => room.Fits(guests)
                                     && (room.HasSeaView || !wantsSeaView)
                                     && !room.IsUnderRenovation);
}
