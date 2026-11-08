namespace CodeSmells.Data.MagicNumbers.Refactored;

// REFACTOR: Replace Magic Literal with Symbolic Constant / Enum. Each literal gets a name that
// explains its meaning and lives in a single place.
public enum VehicleType { Car, Motorbike, Caravan }

public static class ParkingFeeCalculator
{
    private const int FreeGraceMinutes = 15;
    private const int MinutesPerHour = 60;
    private const decimal HourlyRate = 2.5m;
    private const decimal MotorbikeFactor = 0.5m;
    private const decimal CaravanSurcharge = 20m;
    private const decimal WeekendDailyCap = 20m;

    public static decimal Fee(int minutes, VehicleType vehicle, bool isWeekend)
    {
        if (minutes <= FreeGraceMinutes)
        {
            return 0m;
        }

        var billedHours = (int)Math.Ceiling(minutes / (double)MinutesPerHour);
        var fee = vehicle switch
        {
            VehicleType.Motorbike => billedHours * HourlyRate * MotorbikeFactor,
            VehicleType.Caravan => billedHours * HourlyRate + CaravanSurcharge,
            _ => billedHours * HourlyRate,
        };
        return isWeekend ? Math.Min(fee, WeekendDailyCap) : fee;
    }
}
