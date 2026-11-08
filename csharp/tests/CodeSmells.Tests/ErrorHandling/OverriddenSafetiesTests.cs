using S = CodeSmells.ErrorHandling.OverriddenSafeties.Smelly;
using R = CodeSmells.ErrorHandling.OverriddenSafeties.Refactored;

namespace CodeSmells.Tests.ErrorHandling;

public class OverriddenSafetiesTests
{
    [Fact]
    public void Complete_records_produce_the_same_entry()
    {
        var s = S.DirectoryImporter.ToDirectoryEntry(new S.EmployeeRecord("E1", " Ana@Corp.Test ", "boss"));
        var r = R.DirectoryImporter.ToDirectoryEntry(new R.EmployeeRecord("E1", " Ana@Corp.Test ", "boss"));
        Assert.Equal(new R.ImportResult.Ok(s), r);
    }

    [Fact]
    public void Silenced_warning_becomes_a_runtime_crash()
    {
        Assert.Throws<NullReferenceException>(() => S.DirectoryImporter.ToDirectoryEntry(new S.EmployeeRecord("CEO", "ceo@corp.test", null)));
        Assert.Throws<NullReferenceException>(() => S.DirectoryImporter.ToDirectoryEntry(new S.EmployeeRecord("E2", null, "boss")));

        Assert.Equal(new R.ImportResult.Ok("CEO|ceo@corp.test|corp.test|-"),
            R.DirectoryImporter.ToDirectoryEntry(new R.EmployeeRecord("CEO", "ceo@corp.test", null)));
        Assert.IsType<R.ImportResult.Invalid>(R.DirectoryImporter.ToDirectoryEntry(new R.EmployeeRecord("E2", null, "boss")));
    }
}
