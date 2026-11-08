using System.Globalization;

namespace CodeSmells.Functions.FlagArguments.Refactored;

public sealed record Employee(string Name, string Department, decimal Salary);

// REFACTOR: Remove Flag Argument (Split Function). One explicit function per behavior;
// the name replaces the boolean at the call site.
public static class PayrollExporter
{
    private static readonly CultureInfo C = CultureInfo.InvariantCulture;

    public static string ExportDetail(IEnumerable<Employee> employees) =>
        Lines(employees.OrderBy(e => e.Name)
            .Select(e => string.Format(C, "{0};{1};{2:0.00}", e.Name, e.Department, e.Salary)));

    public static string ExportDepartmentSummary(IEnumerable<Employee> employees) =>
        Lines(employees.GroupBy(e => e.Department).OrderBy(g => g.Key)
            .Select(g => string.Format(C, "{0}: {1} employees, {2:0.00}", g.Key, g.Count(), g.Sum(e => e.Salary))));

    private static string Lines(IEnumerable<string> lines) => string.Concat(lines.Select(l => l + Environment.NewLine));
}
