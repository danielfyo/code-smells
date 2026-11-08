namespace CodeSmells.Dispensables.DuplicateCode.Smelly;

public sealed record Payslip(decimal Gross, decimal SocialSecurity, decimal IncomeTax, decimal Net);

public sealed class PayrollCalculator
{
    // SMELL: Duplicate Code. Both payslips repeat the social security, income tax and rounding
    // calculation. They have already drifted apart: the part-time copy forgets the contribution cap.
    public Payslip FullTime(decimal monthlySalary)
    {
        var gross = monthlySalary;
        var ssBase = Math.Min(gross, 4720.50m);
        var socialSecurity = Math.Round(ssBase * 0.0635m, 2);
        var incomeTax = Math.Round(gross > 2000m ? gross * 0.19m : gross * 0.12m, 2);
        return new Payslip(gross, socialSecurity, incomeTax, gross - socialSecurity - incomeTax);
    }

    public Payslip PartTime(decimal hourlyRate, int hours)
    {
        var gross = hourlyRate * hours;
        var socialSecurity = Math.Round(gross * 0.0635m, 2); // no cap!
        var incomeTax = Math.Round(gross > 2000m ? gross * 0.19m : gross * 0.12m, 2);
        return new Payslip(gross, socialSecurity, incomeTax, gross - socialSecurity - incomeTax);
    }
}
