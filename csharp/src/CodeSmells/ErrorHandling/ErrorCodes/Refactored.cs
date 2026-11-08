namespace CodeSmells.ErrorHandling.ErrorCodes.Refactored;

// REFACTOR: Replace Error Code with an explicit result type. The result is a closed hierarchy:
// to get the booking number you must match the case, so an error can never be mistaken for data.
public abstract record BookingResult
{
    private BookingResult() { }
    public sealed record Booked(int BookingNumber) : BookingResult;
    public sealed record UnknownEvent(string EventId) : BookingResult;
    public sealed record SoldOut(int SeatsLeft) : BookingResult;
    public sealed record InvalidQuantity(int Quantity) : BookingResult;
}

public sealed class TicketOffice
{
    private readonly Dictionary<string, int> _availableSeats = new();
    private int _nextBooking = 1000;

    public void AddEvent(string eventId, int seats) => _availableSeats[eventId] = seats;

    public BookingResult Book(string eventId, int quantity)
    {
        if (quantity <= 0)
        {
            return new BookingResult.InvalidQuantity(quantity);
        }

        if (!_availableSeats.TryGetValue(eventId, out var left))
        {
            return new BookingResult.UnknownEvent(eventId);
        }

        if (left < quantity)
        {
            return new BookingResult.SoldOut(left);
        }

        _availableSeats[eventId] = left - quantity;
        return new BookingResult.Booked(_nextBooking++);
    }
}

public static class BookingUi
{
    public static string Describe(BookingResult result) => result switch
    {
        BookingResult.Booked b => $"Booking #{b.BookingNumber}",
        BookingResult.UnknownEvent => "Unknown event",
        BookingResult.SoldOut => "Sold out",
        BookingResult.InvalidQuantity => "Invalid quantity",
        _ => throw new ArgumentOutOfRangeException(nameof(result)),
    };
}
