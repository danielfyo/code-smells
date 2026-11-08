namespace CodeSmells.Tests.UntestedBoundaries;

// Production code. The "Untested Boundary Conditions" smell lives in
// tests/CodeSmells.Tests/Tests/UntestedBoundaries/.
public enum TicketType { Child, Teen, Adult, Senior }

public static class AgeCategory
{
    public static TicketType Classify(int age) => age switch
    {
        < 0 => throw new ArgumentOutOfRangeException(nameof(age)),
        <= 12 => TicketType.Child,
        <= 17 => TicketType.Teen,
        <= 64 => TicketType.Adult,
        _ => TicketType.Senior,
    };
}
