namespace CodeSmells.General.ObviousBehaviorUnimplemented.Refactored;

public static class DayParser
{
    // REFACTOR: Principle of least surprise: implement what the name leads callers to expect
    //           (case-insensitive, surrounding spaces and three-letter abbreviations).
    public static DayOfWeek ParseDay(string dayName)
    {
        ArgumentNullException.ThrowIfNull(dayName);
        var normalized = dayName.Trim();

        foreach (var day in Enum.GetValues<DayOfWeek>())
        {
            var fullName = day.ToString();
            if (normalized.Equals(fullName, StringComparison.OrdinalIgnoreCase) ||
                normalized.Equals(fullName[..3], StringComparison.OrdinalIgnoreCase))
            {
                return day;
            }
        }

        throw new FormatException($"Unknown day '{dayName}'");
    }
}
