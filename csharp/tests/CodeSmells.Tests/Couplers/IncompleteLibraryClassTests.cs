using R = CodeSmells.Couplers.IncompleteLibraryClass.Refactored;
using S = CodeSmells.Couplers.IncompleteLibraryClass.Smelly;

namespace CodeSmells.Tests.Couplers;

public class IncompleteLibraryClassTests
{
    private static readonly HashSet<DateOnly> Holidays = [new(2024, 12, 25), new(2024, 12, 26)];
    private static readonly DateOnly Friday = new(2024, 12, 20);

    [Fact]
    public void Delivery_estimates_match()
    {
        Assert.Equal(new S.DeliveryEstimator(Holidays).EstimatedDelivery(Friday, 3),
                     new R.DeliveryEstimator(Holidays).EstimatedDelivery(Friday, 3));
        Assert.Equal(new DateOnly(2024, 12, 27), R.BusinessCalendarExtensions.AddBusinessDays(Friday, 3, Holidays));
    }

    [Fact]
    public void Duplicated_smelly_copy_ignores_holidays()
    {
        Assert.Equal(new DateOnly(2024, 12, 25), new S.InvoiceDueDateCalculator().DueDate(Friday, 3)); // Christmas Day!
        Assert.Equal(new DateOnly(2024, 12, 27), new R.InvoiceDueDateCalculator(Holidays).DueDate(Friday, 3));
    }
}

