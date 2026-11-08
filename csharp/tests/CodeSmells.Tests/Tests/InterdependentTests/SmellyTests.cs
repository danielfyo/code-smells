using CodeSmells.Tests.InterdependentTests;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace CodeSmells.Tests.Tests.InterdependentTests;

// SMELL: the tests share a STATIC mutable repository, and each one depends on what the previous one left.
//        To make them pass, the execution order must be forced with a custom orderer (by design, xUnit
//        does not guarantee ordering). Running one alone, or in another order, breaks them.
[TestCaseOrderer("CodeSmells.Tests.Tests.InterdependentTests.AlphabeticalOrderer", "CodeSmells.Tests")]
public class SmellyTests
{
    private static readonly InMemoryUserRepository SharedRepository = new();

    [Fact]
    public void Test1_adds_user()
    {
        SharedRepository.Add(new User(1, "ana@shop.test"));
        Assert.Equal(1, SharedRepository.Count);
    }

    [Fact]
    public void Test2_finds_user_added_by_previous_test() =>
        Assert.Equal("ana@shop.test", SharedRepository.Find(1)?.Email); // depends on Test1

    [Fact]
    public void Test3_deletes_user_added_by_previous_test()
    {
        Assert.True(SharedRepository.Delete(1)); // depends on Test1 (and breaks Test2 if it runs first)
        Assert.Equal(0, SharedRepository.Count);
    }
}

// SMELL: extra infrastructure whose only reason to exist is to prop up the coupling between tests.
public class AlphabeticalOrderer : ITestCaseOrderer
{
    public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases)
        where TTestCase : ITestCase =>
        testCases.OrderBy(t => t.TestMethod.Method.Name, StringComparer.Ordinal);
}
