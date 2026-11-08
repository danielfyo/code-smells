namespace CodeSmells.Dispensables.DeadCode.Smelly;

public sealed class LoyaltyPointsCalculator
{
    // SMELL: Dead Code. A constant and a field nobody reads.
    private const int LegacyMultiplier = 3;
    private readonly List<string> _auditTrail = new();

    // SMELL: the 'channel' parameter has not been used since store and web were unified.
    public int PointsFor(decimal amount, string tier, string channel)
    {
        var points = (int)Math.Floor(amount);
        var bonus = 0; // SMELL: variable assigned and never read

        if (tier == "gold")
            points *= 2;
        else if (tier == "silver")
            points = points * 3 / 2;

        if (amount < 0)
        {
            // SMELL: unreachable branch: negative amounts are rejected earlier, at the till.
            return 0;
        }

        return points;

        // SMELL: commented-out code kept "just in case".
        // if (channel == "web") points += 10;
    }

    // SMELL: private method nobody calls.
    private int OldPromoPoints(decimal amount) => (int)amount * LegacyMultiplier;
}
