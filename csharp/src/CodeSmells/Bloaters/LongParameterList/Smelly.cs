namespace CodeSmells.Bloaters.LongParameterList.Smelly;

public sealed class HotelBookingService
{
    // SMELL: Long Parameter List. Nine parameters, several of the same type (two DateOnly, three
    // int, two string): it is very easy to swap checkIn/checkOut or adults/children without the
    // compiler complaining, and every new option makes the signature even longer.
    public decimal Quote(
        string hotelCode,
        DateOnly checkIn,
        DateOnly checkOut,
        int adults,
        int children,
        int rooms,
        decimal nightlyRate,
        bool breakfastIncluded,
        string promoCode)
    {
        var nights = checkOut.DayNumber - checkIn.DayNumber;
        if (nights <= 0) throw new ArgumentException("Check-out must be after check-in");
        var total = nights * rooms * nightlyRate;
        if (breakfastIncluded)
            total += nights * (adults * 12m + children * 6m);
        if (promoCode == "SUMMER10")
            total *= 0.90m;
        return Math.Round(total, 2);
    }
}
