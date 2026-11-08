using R = CodeSmells.Names.NonStandardNomenclature.Refactored;
using S = CodeSmells.Names.NonStandardNomenclature.Smelly;

namespace CodeSmells.Tests.Names;

public class NonStandardNomenclatureTests
{
    [Fact]
    public async Task Both_versions_write_the_same_contents()
    {
        var smelly = S.ReportFile.Manufacture("sales");
        smelly.Write("total=10");
        var smellyContents = await smelly.Contents();
        smelly.Kill();

        using var refactored = R.ReportFile.Create("sales");
        refactored.Write("total=10");

        Assert.Equal(smellyContents, await refactored.GetContentsAsync());
    }

    [Fact]
    public void Only_the_refactored_version_works_with_standard_collections()
    {
        var smellySet = new HashSet<S.ReportFile> { S.ReportFile.Manufacture("a"), S.ReportFile.Manufacture("a") };
        var refactoredSet = new HashSet<R.ReportFile> { R.ReportFile.Create("a"), R.ReportFile.Create("a") };

        Assert.True(S.ReportFile.Manufacture("a").IsSame(S.ReportFile.Manufacture("a")));
        Assert.Equal(2, smellySet.Count); // HashSet knows nothing about "IsSame"
        Assert.Single(refactoredSet);
    }
}
