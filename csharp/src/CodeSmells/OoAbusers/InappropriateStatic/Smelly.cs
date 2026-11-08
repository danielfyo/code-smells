namespace CodeSmells.OoAbusers.InappropriateStatic.Smelly;

public sealed record Booking(string Reference, DateTime StartsAt, decimal Price);

// SMELL: Inappropriate Static. The cancellation policy is static and reads the system clock
// directly. It cannot be replaced by another policy (e.g. a flexible rate) nor can we test
// "what happens if I cancel 2 hours before" without waiting for that moment to arrive.
public static class CancellationPolicy
{
    public static decimal Fee(Booking booking)
    {
        var hoursLeft = (booking.StartsAt - DateTime.Now).TotalHours;
        if (hoursLeft >= 48) return 0m;
        if (hoursLeft >= 24) return booking.Price * 0.5m;
        return booking.Price;
    }
}

public sealed class BookingService
{
    public decimal Cancel(Booking booking) => CancellationPolicy.Fee(booking); // hidden dependency
}
