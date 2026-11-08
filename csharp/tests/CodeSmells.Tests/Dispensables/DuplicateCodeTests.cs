using S = CodeSmells.Dispensables.DuplicateCode.Smelly;
using R = CodeSmells.Dispensables.DuplicateCode.Refactored;

namespace CodeSmells.Tests.Dispensables;

public class DuplicateCodeTests
{
    [Theory]
    [InlineData(1500)]
    [InlineData(3200)]
    [InlineData(6000)]
    public void Full_time_payslips_match(int salary)
    {
        var s = new S.PayrollCalculator().FullTime(salary);
        var r = new R.PayrollCalculator().FullTime(salary);
        Assert.Equal((s.Gross, s.SocialSecurity, s.IncomeTax, s.Net), (r.Gross, r.SocialSecurity, r.IncomeTax, r.Net));
    }

    [Fact]
    public void Part_time_matches_below_the_contribution_cap()
    {
        var s = new S.PayrollCalculator().PartTime(15m, 80);
        var r = new R.PayrollCalculator().PartTime(15m, 80);
        Assert.Equal(s.Net, r.Net);
    }

    [Fact]
    public void Duplicated_copy_diverged_and_forgot_the_cap()
    {
        // Bug caused by the smell: with a high salary the part-time copy does not apply the cap.
        var s = new S.PayrollCalculator().PartTime(100m, 60); // 6000 gross
        var r = new R.PayrollCalculator().PartTime(100m, 60);
        Assert.Equal(381.00m, s.SocialSecurity);
        Assert.Equal(299.75m, r.SocialSecurity);
        Assert.Equal(new R.PayrollCalculator().FullTime(6000m).SocialSecurity, r.SocialSecurity);
    }
}
