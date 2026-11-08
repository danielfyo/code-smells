namespace CodeSmells.Tests;

// Note: this class lives in the CodeSmells.Tests namespace (not CodeSmells.Tests.Environment) so that it
// does not shadow System.Environment for the rest of the test project. Its full name still starts with
// "CodeSmells.Tests.Environment", so the per-category filter finds it.
public class EnvironmentSmellsTests
{
    private static string SmellFolder(string slug)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "CodeSmells.sln")))
        {
            dir = dir.Parent;
        }
        Assert.NotNull(dir);
        return Path.Combine(dir!.FullName, "csharp", "src", "CodeSmells", "Environment", slug);
    }

    [Theory]
    [InlineData("MultiStepBuild", "smelly/BUILD.md", "refactored/build.sh", "dotnet build")]
    [InlineData("MultiStepTests", "smelly/TESTING.md", "refactored/test.sh", "dotnet test")]
    public void Smelly_recipe_has_many_steps_and_refactored_script_runs_one_command(
        string slug, string smellyDoc, string script, string command)
    {
        var folder = SmellFolder(slug);
        Assert.True(File.Exists(Path.Combine(folder, "README.md")));

        var manualSteps = File.ReadLines(Path.Combine(folder, smellyDoc))
            .Count(line => line.Length > 2 && char.IsDigit(line[0]) && line.Contains(". "));
        Assert.True(manualSteps >= 5, $"Expected a long manual recipe, found {manualSteps} steps");

        var scriptText = File.ReadAllText(Path.Combine(folder, script));
        Assert.StartsWith("#!/usr/bin/env bash", scriptText);
        Assert.Contains("set -euo pipefail", scriptText);
        Assert.Contains($"{command} CodeSmells.sln", scriptText);
    }
}
