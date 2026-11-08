namespace CodeSmells.Tests.SleepyTest.Refactored;

// REFACTOR: background work leaves an observable signal (WhenIdleAsync) that lets callers wait
//           exactly as long as needed. Also useful in production (e.g. for a graceful shutdown).
public class NotificationOutbox
{
    private readonly List<string> _sent = new();
    private readonly List<Task> _pending = new();

    public IReadOnlyList<string> Sent
    {
        get { lock (_sent)
            {
                return _sent.ToList();
            }
        }
    }

    public void Enqueue(string message)
    {
        var work = Task.Run(async () =>
        {
            await Task.Delay(20);
            lock (_sent)
            {
                _sent.Add(message);
            }
        });
        lock (_pending)
        {
            _pending.Add(work);
        }
    }

    public Task WhenIdleAsync()
    {
        lock (_pending)
        {
            return Task.WhenAll(_pending.ToArray());
        }
    }
}
