using R = CodeSmells.General.CallbackHell.Refactored;
using S = CodeSmells.General.CallbackHell.Smelly;

namespace CodeSmells.Tests.General;

public class CallbackHellTests
{
    private static Task<string> RunSmelly(int customerId)
    {
        // Testing the callback version requires adapting it to a Task by hand.
        var tcs = new TaskCompletionSource<string>();
        new S.OrderSummaryService().GetSummary(customerId, tcs.SetResult, ex => tcs.SetException(ex));
        return tcs.Task;
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public async Task Both_services_produce_the_same_summary(int customerId)
    {
        var smelly = await RunSmelly(customerId);
        var refactored = await new R.OrderSummaryService().GetSummaryAsync(customerId);

        Assert.Equal(smelly, refactored);
    }

    [Fact]
    public async Task Errors_propagate_in_both_versions()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => RunSmelly(0));
        await Assert.ThrowsAsync<ArgumentException>(() => new R.OrderSummaryService().GetSummaryAsync(0));
    }
}
