namespace CodeSmells.CsharpSpecific.DatetimeNowDependency.Smelly;

public class HappyHourPricing
{
    // SMELL: hidden dependency on the system clock. The result changes depending on WHEN it runs:
    //        tests cannot check the discount deterministically (they pass or fail depending on the time
    //        of day), and time zone issues on servers in UTC go unnoticed.
    public decimal PriceFor(decimal listPrice) =>
        DateTime.Now.Hour is >= 17 and < 19 ? listPrice * 0.8m : listPrice;

    public bool IsHappyHourNow() => DateTime.Now.Hour is >= 17 and < 19;
}
