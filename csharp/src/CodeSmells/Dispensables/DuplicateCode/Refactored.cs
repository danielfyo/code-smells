namespace CodeSmells.Dispensables.DuplicateCode.Refactored;

public sealed record Payslip(decimal Gross, decimal SocialSecurity, decimal IncomeTax, decimal Net);

public sealed class PayrollCalculator
{
    private const decimal MaxContributionBase = 4720.50m;
    private const decimal SocialSecurityRate = 0.0635m;

    // REFACTOR: Extract Method. What varies (how the gross amount is obtained) stays in each public
    // method; what is shared (deductions) lives in a single place and is fixed only once.
    public Payslip FullTime(decimal monthlySalary) => FromGross(monthlySalary);

    public Payslip PartTime(decimal hourlyRate, int hours) => FromGross(hourlyRate * hours);

    private static Payslip FromGross(decimal gross)
    {
        var socialSecurity = Math.Round(Math.Min(gross, MaxContributionBase) * SocialSecurityRate, 2);
        var incomeTax = Math.Round(gross * (gross > 2000m ? 0.19m : 0.12m), 2);
        return new Payslip(gross, socialSecurity, incomeTax, gross - socialSecurity - incomeTax);
    }
}
