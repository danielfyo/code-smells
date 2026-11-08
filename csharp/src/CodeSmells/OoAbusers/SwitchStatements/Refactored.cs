namespace CodeSmells.OoAbusers.SwitchStatements.Refactored;

// REFACTOR: Replace Conditional with Polymorphism. Each employee type is a class that knows how
// to compute its pay, its vacation days and its label. A new type is a new class; there are no
// switches to hunt down.
public abstract record Employee(string Name)
{
    public abstract decimal MonthlyPay();
    public abstract int VacationDays { get; }
    protected abstract string Kind { get; }
    public string PayslipLabel => $"{Name} ({Kind})";
}

public sealed record SalariedEmployee(string Name, decimal MonthlySalary) : Employee(Name)
{
    public override decimal MonthlyPay() => MonthlySalary;
    public override int VacationDays => 23;
    protected override string Kind => "staff";
}

public sealed record HourlyEmployee(string Name, decimal HourlyRate, int HoursWorked) : Employee(Name)
{
    private const int RegularHours = 160;

    public override decimal MonthlyPay()
    {
        var overtime = Math.Max(0, HoursWorked - RegularHours);
        return (HoursWorked - overtime) * HourlyRate + overtime * HourlyRate * 1.5m;
    }

    public override int VacationDays => 22;
    protected override string Kind => "hourly";
}

public sealed record Contractor(string Name, decimal HourlyRate, int HoursWorked) : Employee(Name)
{
    public override decimal MonthlyPay() => HoursWorked * HourlyRate;
    public override int VacationDays => 0;
    protected override string Kind => "contractor";
}
