namespace CodeSmells.OoAbusers.SwitchStatements.Smelly;

public enum EmployeeType { Salaried, Hourly, Contractor }

public sealed class Employee
{
    public string Name { get; init; } = "";
    public EmployeeType Type { get; init; }
    public decimal MonthlySalary { get; init; }
    public decimal HourlyRate { get; init; }
    public int HoursWorked { get; init; }
}

public static class Payroll
{
    // SMELL: Repeated Switches. The same switch on EmployeeType appears in MonthlyPay,
    // VacationDays and PayslipLabel. Adding "Intern" means finding and changing all of them
    // (and the compiler will not warn if we forget one: it silently falls into the default).
    public static decimal MonthlyPay(Employee e)
    {
        switch (e.Type)
        {
            case EmployeeType.Salaried: return e.MonthlySalary;
            case EmployeeType.Hourly:
                var overtime = Math.Max(0, e.HoursWorked - 160);
                return (e.HoursWorked - overtime) * e.HourlyRate + overtime * e.HourlyRate * 1.5m;
            case EmployeeType.Contractor: return e.HoursWorked * e.HourlyRate;
            default: throw new ArgumentOutOfRangeException(nameof(e));
        }
    }

    public static int VacationDays(Employee e)
    {
        switch (e.Type)
        {
            case EmployeeType.Salaried: return 23;
            case EmployeeType.Hourly: return 22;
            default: return 0;
        }
    }

    public static string PayslipLabel(Employee e) => e.Type switch
    {
        EmployeeType.Salaried => $"{e.Name} (staff)",
        EmployeeType.Hourly => $"{e.Name} (hourly)",
        _ => $"{e.Name} (contractor)",
    };
}
