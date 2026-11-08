using S = CodeSmells.Couplers.HiddenTemporalCoupling.Smelly;
using R = CodeSmells.Couplers.HiddenTemporalCoupling.Refactored;

namespace CodeSmells.Tests.Couplers;

public class HiddenTemporalCouplingTests
{
    [Fact]
    public void Correct_order_gives_same_receipt()
    {
        var s = new S.PaymentGateway();
        s.Configure("M-42", "EUR");
        s.OpenSession();
        var session = new R.PaymentGateway(new R.MerchantConfig("M-42", "EUR")).OpenSession();
        Assert.Equal(s.Charge("4111111111111111", 25m), session.Charge("4111111111111111", 25m));
    }

    [Fact]
    public void Smelly_fails_or_misbehaves_when_order_is_wrong()
    {
        var forgotSession = new S.PaymentGateway();
        forgotSession.Configure("M-42", "EUR");
        Assert.Throws<NullReferenceException>(() => forgotSession.Charge("4111111111111111", 10m));

        var forgotConfigure = new S.PaymentGateway();
        forgotConfigure.OpenSession();
        Assert.EndsWith("USD", forgotConfigure.Charge("4111111111111111", 10m)); // charges in the wrong currency
    }
}
