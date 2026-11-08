using CodeSmells.Tests.SleepyTest.Refactored;

namespace CodeSmells.Tests.Tests.SleepyTest;

// REFACTOR: wait for the completion signal (with a generous timeout as a safety net),
//           not for an arbitrary time. The test lasts as long as the work and never fails for being "slow".
public class RefactoredTests
{
    [Fact]
    public async Task Sends_notification_in_background()
    {
        var queue = new NotificationQueue();

        queue.Enqueue("Order #1 shipped");
        await queue.WhenIdleAsync().WaitAsync(TimeSpan.FromSeconds(5));

        Assert.Equal(new[] { "Order #1 shipped" }, queue.Sent);
    }
}
