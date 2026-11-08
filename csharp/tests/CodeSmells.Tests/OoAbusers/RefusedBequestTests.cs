using S = CodeSmells.OoAbusers.RefusedBequest.Smelly;
using R = CodeSmells.OoAbusers.RefusedBequest.Refactored;

namespace CodeSmells.Tests.OoAbusers;

public class RefusedBequestTests
{
    [Fact]
    public void Smelly_subclass_breaks_code_written_against_base_class()
    {
        var checking = new S.CheckingAccount();
        checking.Deposit(100m);
        var deposit = new S.FixedTermDeposit(1000m, new DateOnly(2030, 1, 1));
        Assert.Throws<NotSupportedException>(() => S.MonthlyFees.Charge([checking, deposit], 2m));
    }

    [Fact]
    public void Refactored_charges_only_withdrawable_accounts()
    {
        var checking = new R.CheckingAccount();
        checking.Deposit(100m);
        R.MonthlyFees.Charge([checking], 2m);
        Assert.Equal(98m, checking.Balance);
        // R.MonthlyFees.Charge([new R.FixedTermDeposit(...)], 2m) does not even compile.
    }

    [Fact]
    public void Closing_deposit_behaves_the_same()
    {
        var maturity = new DateOnly(2025, 1, 1);
        var s = new S.FixedTermDeposit(500m, maturity);
        var r = new R.FixedTermDeposit(500m, maturity);
        Assert.Throws<InvalidOperationException>(() => s.Close(maturity.AddDays(-1)));
        Assert.Throws<InvalidOperationException>(() => r.Close(maturity.AddDays(-1)));
        Assert.Equal(s.Close(maturity), r.Close(maturity));
    }
}
