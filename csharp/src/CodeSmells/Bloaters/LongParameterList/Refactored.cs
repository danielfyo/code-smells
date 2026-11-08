namespace CodeSmells.Bloaters.LongParameterList.Refactored;

// REFACTOR: Introduce Parameter Object. Data that travels together is grouped into named
// types; invariants (check-out > check-in) are validated once, when they are built.
public readonly record struct Stay
{
    public DateOnly CheckIn { get; }
    public DateOnly CheckOut { get; }
    public int Nights => CheckOut.DayNumber - CheckIn.DayNumber;

    public Stay(DateOnly checkIn, DateOnly checkOut)
    {
        if (checkOut <= checkIn)
        {
            throw new ArgumentException("Check-out must be after check-in");
        }

        (CheckIn, CheckOut) = (checkIn, checkOut);
    }
}

public sealed record Guests(int Adults, int Children = 0);

public sealed record BookingRequest(string HotelCode, Stay Stay, Guests Guests, int Rooms = 1,
    bool BreakfastIncluded = false, string? PromoCode = null);

public sealed class HotelBookingService
{
    // REFACTOR: Preserve Whole Object. The rate (which would come from the hotel) and the request
    // are two arguments with a clear meaning instead of nine loose ones.
    public decimal Quote(BookingRequest request, decimal nightlyRate)
    {
        var nights = request.Stay.Nights;
        var total = nights * request.Rooms * nightlyRate;
        if (request.BreakfastIncluded)
        {
            total += nights * (request.Guests.Adults * 12m + request.Guests.Children * 6m);
        }

        if (request.PromoCode == "SUMMER10")
        {
            total *= 0.90m;
        }

        return Math.Round(total, 2);
    }
}
