using System.Globalization;
using System.Text;

namespace CodeSmells.Functions.FlagArguments.Smelly;

public sealed record Employee(string Name, string Department, decimal Salary);

public static class PayrollExporter
{
    // SMELL: Flag Argument. The 'summaryOnly' boolean turns the function into two different
    // functions crammed into one. At the call Export(staff, true) nobody knows what 'true' does,
    // and each branch has its own rules mixed with the other's.
    public static string Export(IEnumerable<Employee> employees, bool summaryOnly)
    {
        var c = CultureInfo.InvariantCulture;
        var sb = new StringBuilder();
        if (summaryOnly)
        {
            foreach (var group in employees.GroupBy(e => e.Department).OrderBy(g => g.Key))
                sb.AppendLine(string.Format(c, "{0}: {1} employees, {2:0.00}", group.Key, group.Count(), group.Sum(e => e.Salary)));
        }
        else
        {
            foreach (var e in employees.OrderBy(e => e.Name))
                sb.AppendLine(string.Format(c, "{0};{1};{2:0.00}", e.Name, e.Department, e.Salary));
        }
        return sb.ToString();
    }
}
