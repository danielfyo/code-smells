using R = CodeSmells.General.ConventionOverStructure.Refactored;
using S = CodeSmells.General.ConventionOverStructure.Smelly;

namespace CodeSmells.Tests.General;

public class ConventionOverStructureTests
{
    public static TheoryData<S.PaymentMethod, string> Methods => new()
    {
        { S.PaymentMethod.Card, nameof(R.PaymentMethod.Card) },
        { S.PaymentMethod.Transfer, nameof(R.PaymentMethod.Transfer) },
        { S.PaymentMethod.PayPal, nameof(R.PaymentMethod.PayPal) },
    };

    [Theory]
    [MemberData(nameof(Methods))]
    public void Fees_and_labels_match(S.PaymentMethod smelly, string refactoredName)
    {
        var refactored = (R.PaymentMethod)typeof(R.PaymentMethod).GetField(refactoredName)!.GetValue(null)!;

        Assert.Equal(S.PaymentRules.Fee(smelly, 200m), refactored.Fee(200m));
        Assert.Equal(S.PaymentRules.Label(smelly), refactored.Label);
    }

    [Fact]
    public void Smelly_switch_fails_at_runtime_for_unknown_values()
    {
        var newMethodNobodyRemembered = (S.PaymentMethod)99;
        Assert.Throws<NotSupportedException>(() => S.PaymentRules.Fee(newMethodNobodyRemembered, 10m));
    }
}
