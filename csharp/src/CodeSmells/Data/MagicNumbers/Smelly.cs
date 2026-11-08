namespace CodeSmells.Data.MagicNumbers.Smelly;

public static class ParkingFeeCalculator
{
    // SMELL: Magic Numbers / Magic Strings. What is 15? And 2.5, 20, 0.5 or "R"? You have to
    // guess, and 20 appears twice with two different meanings (cap and surcharge).
    public static decimal Fee(int minutes, string vehicleCode, bool isWeekend)
    {
        if (minutes <= 15) return 0m;
        var hours = (int)Math.Ceiling(minutes / 60.0);
        var fee = hours * 2.5m;
        if (vehicleCode == "M") fee *= 0.5m;
        if (vehicleCode == "R") fee += 20;
        if (isWeekend) fee = Math.Min(fee, 20m);
        return fee;
    }
}
