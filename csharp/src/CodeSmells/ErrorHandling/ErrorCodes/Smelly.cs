namespace CodeSmells.ErrorHandling.ErrorCodes.Smelly;

public sealed class TicketOffice
{
    private readonly Dictionary<string, int> _availableSeats = new();
    private int _nextBooking = 1000;

    public void AddEvent(string eventId, int seats) => _availableSeats[eventId] = seats;

    // SMELL: Returning Error Codes. Returns the booking number... or -1 if the event does not
    // exist, -2 if it is sold out, -3 if the quantity is invalid. The caller can ignore the code
    // and treat -2 as if it were a valid booking number.
    public int Book(string eventId, int quantity)
    {
        if (quantity <= 0) return -3;
        if (!_availableSeats.TryGetValue(eventId, out var left)) return -1;
        if (left < quantity) return -2;
        _availableSeats[eventId] = left - quantity;
        return _nextBooking++;
    }
}

public static class BookingUi
{
    // SMELL: decoding the magic codes is repeated in every client.
    public static string Describe(int result) => result switch
    {
        -1 => "Unknown event",
        -2 => "Sold out",
        -3 => "Invalid quantity",
        _ => $"Booking #{result}",
    };
}
