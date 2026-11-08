namespace CodeSmells.Tests;

/// <summary>
/// Tests that rely on real waiting (the smelly side of the "Sleepy Test" and "Slow Tests" examples)
/// run in this collection, which xUnit never runs in parallel with other tests. Otherwise a busy thread
/// pool can delay their background work past the fixed sleep and make the suite fail intermittently.
/// </summary>
[CollectionDefinition(Name, DisableParallelization = true)]
public sealed class TimingSensitiveTests
{
    public const string Name = "Timing-sensitive tests";
}
