namespace CodeSmells.Couplers.IncompleteLibraryClass.Refactored;

// REFACTOR: Introduce Local Extension (extension method). What the library class is missing is
// added in a single place and used as if it were native.
public static class BusinessCalendarExtensions
{
    public static bool IsBusinessDay(this DateOnly date, ISet<DateOnly> holidays) =>
        date.DayOfWeek is not (DayOfWeek.Saturday or DayOfWeek.Sunday) && !holidays.Contains(date);

    public static DateOnly AddBusinessDays(this DateOnly start, int businessDays, ISet<DateOnly> holidays)
    {
        var date = start;
        for (var added = 0; added < businessDays;)
        {
            date = date.AddDays(1);
            if (date.IsBusinessDay(holidays)) added++;
        }
        return date;
    }
}

public sealed class DeliveryEstimator(ISet<DateOnly> holidays)
{
    public DateOnly EstimatedDelivery(DateOnly shippedOn, int businessDays) => shippedOn.AddBusinessDays(businessDays, holidays);
}

public sealed class InvoiceDueDateCalculator(ISet<DateOnly> holidays)
{
    public DateOnly DueDate(DateOnly issuedOn, int businessDays) => issuedOn.AddBusinessDays(businessDays, holidays);
}
