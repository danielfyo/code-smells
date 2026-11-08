using R = CodeSmells.CsharpSpecific.LockOnThis.Refactored;
using S = CodeSmells.CsharpSpecific.LockOnThis.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class LockOnThisTests
{
    [Fact]
    public async Task Smelly_counter_is_blocked_by_external_code_locking_the_instance()
    {
        var counter = new S.StockCounter();
        Task adding;

        lock (counter) // unrelated code that "happens" to lock on the same object
        {
            adding = Task.Run(() => counter.Add(1));
            // A bounded spin instead of Task.Wait: we cannot await while holding the lock.
            Assert.False(SpinWait.SpinUntil(() => adding.IsCompleted, 150), "Add should be blocked by the external lock");
        }

        await adding;
        Assert.Equal(1, counter.Units);
    }

    [Fact]
    public void Refactored_counter_is_not_affected_by_external_locks()
    {
        var counter = new R.StockCounter();

        lock (counter)
        {
            var adding = Task.Run(() => counter.Add(1));
            Assert.True(SpinWait.SpinUntil(() => adding.IsCompleted, TimeSpan.FromSeconds(5)));
        }

        Assert.Equal(1, counter.Units);
    }

    [Fact]
    public void Both_are_correct_under_concurrency()
    {
        var smelly = new S.StockCounter();
        var refactored = new R.StockCounter();

        Parallel.For(0, 1000, _ => { smelly.Add(1); refactored.Add(1); });

        Assert.Equal(1000, smelly.Units);
        Assert.Equal(1000, refactored.Units);
    }
}
