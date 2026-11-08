namespace CodeSmells.Tests.SleepyTest.Smelly;

// SMELL (design that causes the sleepy test): work is fired off in the background "and that's it";
//        there is no way to know when it finishes, so the test can only sleep and cross its fingers.
public class NotificationQueue
{
    private readonly List<string> _sent = new();

    public IReadOnlyList<string> Sent
    {
        get { lock (_sent) return _sent.ToList(); }
    }

    public void Enqueue(string message) =>
        _ = Task.Run(async () =>
        {
            await Task.Delay(20); // simulates sending to an external provider
            lock (_sent) _sent.Add(message);
        });
}
