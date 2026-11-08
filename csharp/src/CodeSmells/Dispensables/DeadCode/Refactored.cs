namespace CodeSmells.Dispensables.DeadCode.Refactored;

public sealed class LoyaltyPointsCalculator
{
    // REFACTOR: Remove Dead Code + Remove Parameter. Unused constants, fields, variables, branches
    // and methods are gone; version control already keeps the history.
    public int PointsFor(decimal amount, string tier)
    {
        var points = (int)Math.Floor(amount);
        return tier switch
        {
            "gold" => points * 2,
            "silver" => points * 3 / 2,
            _ => points,
        };
    }
}
