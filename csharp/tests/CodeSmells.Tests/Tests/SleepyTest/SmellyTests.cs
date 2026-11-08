using CodeSmells.Tests.SleepyTest.Smelly;

namespace CodeSmells.Tests.Tests.SleepyTest;

public class SmellyTests
{
    // SMELL: "magic" Thread.Sleep. If the CI machine is busy and sending takes longer than 200 ms, the test
    //        fails intermittently; if it is fast, 180 ms are wasted. Slow AND non-deterministic.
    [Fact]
    public void Sends_notification_in_background()
    {
        var queue = new NotificationQueue();

        queue.Enqueue("Order #1 shipped");
        Thread.Sleep(200);

        Assert.Equal(new[] { "Order #1 shipped" }, queue.Sent);
    }
}
