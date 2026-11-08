using S = CodeSmells.CsharpSpecific.SyncOverAsync.Smelly;
using R = CodeSmells.CsharpSpecific.SyncOverAsync.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class SyncOverAsyncTests
{
    // "Normal" API: its await captures the caller's context (like most application code).
    private sealed class ProfileApi : S.IProfileApi, R.IProfileApi
    {
        async Task<S.Profile> S.IProfileApi.GetProfileAsync(int id)
        {
            await Task.Delay(10);
            return id > 0 ? new S.Profile(id, "Ana") : throw new KeyNotFoundException();
        }

        async Task<R.Profile> R.IProfileApi.GetProfileAsync(int id)
        {
            await Task.Delay(10);
            return id > 0 ? new R.Profile(id, "Ana") : throw new KeyNotFoundException();
        }
    }

    // Simulates the UI thread: continuations are queued for that thread... which is blocked on .Result.
    private sealed class BlockedUiContext : SynchronizationContext
    {
        public override void Post(SendOrPostCallback d, object? state) { /* queued and never processed */ }
    }

    [Fact]
    public void Smelly_deadlocks_on_a_single_threaded_context()
    {
        var service = new S.ProfileService(new ProfileApi());
        using var finished = new ManualResetEventSlim();
        var uiThread = new Thread(() =>
        {
            SynchronizationContext.SetSynchronizationContext(new BlockedUiContext());
            service.GetProfile(1);
            finished.Set();
        }) { IsBackground = true }; // stays blocked forever: background so it does not prevent the process from exiting

        uiThread.Start();

        Assert.False(finished.Wait(TimeSpan.FromMilliseconds(250)), "Expected a deadlock");
    }

    [Fact]
    public async Task Refactored_returns_the_same_profile_without_blocking()
    {
        var smelly = new S.ProfileService(new ProfileApi()).GetProfile(1); // without a context it "works"...
        var refactored = await new R.ProfileService(new ProfileApi()).GetProfileAsync(1);

        Assert.Equal((smelly.Id, smelly.Name), (refactored.Id, refactored.Name));
    }

    [Fact]
    public async Task Exceptions_are_wrapped_only_in_the_smelly_version()
    {
        var aggregate = Assert.Throws<AggregateException>(() => new S.ProfileService(new ProfileApi()).GetProfile(0));
        Assert.IsType<KeyNotFoundException>(aggregate.InnerException);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => new R.ProfileService(new ProfileApi()).GetProfileAsync(0));
    }
}
