namespace CodeSmells.Couplers.IncompleteLibraryClass.Smelly;

// SMELL: Incomplete Library Class. DateOnly cannot add "business days", so every service
// reimplements the loop on its own. The copies already diverge: one skips public holidays
// and the other does not.
public sealed class DeliveryEstimator(ISet<DateOnly> holidays)
{
    public DateOnly EstimatedDelivery(DateOnly shippedOn, int businessDays)
    {
        var date = shippedOn;
        var added = 0;
        while (added < businessDays)
        {
            date = date.AddDays(1);
            if (date.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday && !holidays.Contains(date))
                added++;
        }
        return date;
    }
}

public sealed class InvoiceDueDateCalculator
{
    public DateOnly DueDate(DateOnly issuedOn, int businessDays)
    {
        var date = issuedOn;
        for (var i = 0; i < businessDays;)
        {
            date = date.AddDays(1);
            if (date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday) i++;
        }
        return date; // SMELL: forgets public holidays
    }
}
