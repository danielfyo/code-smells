using S = CodeSmells.Functions.FlagArguments.Smelly;
using R = CodeSmells.Functions.FlagArguments.Refactored;

namespace CodeSmells.Tests.Functions;

public class FlagArgumentsTests
{
    private static readonly (string, string, decimal)[] Staff =
        [("Zoe", "IT", 3000m), ("Adam", "Sales", 2200m), ("Mia", "IT", 2800m)];

    [Fact]
    public void Split_functions_match_each_flag_value()
    {
        var s = Staff.Select(x => new S.Employee(x.Item1, x.Item2, x.Item3)).ToList();
        var r = Staff.Select(x => new R.Employee(x.Item1, x.Item2, x.Item3)).ToList();
        Assert.Equal(S.PayrollExporter.Export(s, false), R.PayrollExporter.ExportDetail(r));
        Assert.Equal(S.PayrollExporter.Export(s, true), R.PayrollExporter.ExportDepartmentSummary(r));
        Assert.StartsWith("IT: 2 employees, 5800.00", R.PayrollExporter.ExportDepartmentSummary(r));
    }
}
