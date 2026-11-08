using R = CodeSmells.OoAbusers.TemporaryField.Refactored;
using S = CodeSmells.OoAbusers.TemporaryField.Smelly;

namespace CodeSmells.Tests.OoAbusers;

public class TemporaryFieldTests
{
    private static readonly S.CartItem[] SmallS = [new("MUG", 2, 8m)];
    private static readonly R.CartItem[] SmallR = [new("MUG", 2, 8m)];
    private static readonly S.CartItem[] BigS = [new("CHAIR", 1, 60m)];
    private static readonly R.CartItem[] BigR = [new("CHAIR", 1, 60m)];

    [Fact]
    public void First_call_gives_same_result()
    {
        Assert.Equal(new S.CheckoutCalculator().Calculate(BigS, "HALF"), new R.CheckoutCalculator().Calculate(BigR, "HALF"));
        Assert.Equal(new S.CheckoutCalculator().Calculate(SmallS, null), new R.CheckoutCalculator().Calculate(SmallR, null));
    }

    [Fact]
    public void Smelly_leaks_coupon_from_previous_call_refactored_does_not()
    {
        var smelly = new S.CheckoutCalculator();
        smelly.Calculate(BigS, "WELCOME5");
        // Bug: the 5 discount from the previous call is still in the temporary field.
        Assert.Equal(16m, smelly.Calculate(SmallS, null)); // 16 - 5 + 5 shipping

        var refactored = new R.CheckoutCalculator();
        refactored.Calculate(BigR, "WELCOME5");
        Assert.Equal(21m, refactored.Calculate(SmallR, null)); // 16 + 5 shipping
    }
}
