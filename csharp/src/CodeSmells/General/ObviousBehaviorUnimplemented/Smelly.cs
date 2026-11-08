namespace CodeSmells.General.ObviousBehaviorUnimplemented.Smelly;

public static class DayParser
{
    // SMELL: anyone would expect ParseDay to accept "monday", "MONDAY" or "Mon".
    //        It only accepts the exact capitalized English name, so callers
    //        stop trusting the function and end up re-reading its code (or duplicating it).
    public static DayOfWeek ParseDay(string dayName) => dayName switch
    {
        "Monday" => DayOfWeek.Monday,
        "Tuesday" => DayOfWeek.Tuesday,
        "Wednesday" => DayOfWeek.Wednesday,
        "Thursday" => DayOfWeek.Thursday,
        "Friday" => DayOfWeek.Friday,
        "Saturday" => DayOfWeek.Saturday,
        "Sunday" => DayOfWeek.Sunday,
        _ => throw new FormatException($"Unknown day '{dayName}'"),
    };
}
