using S = CodeSmells.OoAbusers.SwitchStatements.Smelly;
using R = CodeSmells.OoAbusers.SwitchStatements.Refactored;

namespace CodeSmells.Tests.OoAbusers;

public class SwitchStatementsTests
{
    public static TheoryData<S.Employee, R.Employee> Pairs => new()
    {
        { new S.Employee { Name = "Ana", Type = S.EmployeeType.Salaried, MonthlySalary = 2500m }, new R.SalariedEmployee("Ana", 2500m) },
        { new S.Employee { Name = "Luis", Type = S.EmployeeType.Hourly, HourlyRate = 10m, HoursWorked = 170 }, new R.HourlyEmployee("Luis", 10m, 170) },
        { new S.Employee { Name = "Eva", Type = S.EmployeeType.Contractor, HourlyRate = 40m, HoursWorked = 80 }, new R.Contractor("Eva", 40m, 80) },
    };

    [Theory]
    [MemberData(nameof(Pairs))]
    public void Polymorphism_matches_switches(S.Employee smelly, R.Employee refactored)
    {
        Assert.Equal(S.Payroll.MonthlyPay(smelly), refactored.MonthlyPay());
        Assert.Equal(S.Payroll.VacationDays(smelly), refactored.VacationDays);
        Assert.Equal(S.Payroll.PayslipLabel(smelly), refactored.PayslipLabel);
    }

    [Fact]
    public void Overtime_is_paid_at_one_and_a_half()
    {
        Assert.Equal(1750m, new R.HourlyEmployee("Luis", 10m, 170).MonthlyPay());
    }
}
