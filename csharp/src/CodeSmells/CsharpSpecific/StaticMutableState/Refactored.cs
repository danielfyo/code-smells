using System.Collections.Concurrent;

namespace CodeSmells.CsharpSpecific.StaticMutableState.Refactored;

// REFACTOR: the state belongs to an instance, whose lifetime is decided by whoever creates it
//           (e.g. a singleton per series registered in DI). Updates are atomic (Interlocked) and the
//           issued numbers are stored in a thread-safe collection exposed as read-only.
public class InvoiceNumberGenerator(string series)
{
    private int _lastNumber;
    private readonly ConcurrentQueue<string> _issued = new();

    public IReadOnlyCollection<string> Issued => _issued;

    public string Next()
    {
        var next = Interlocked.Increment(ref _lastNumber);
        var number = $"{series}-{next:D5}";
        _issued.Enqueue(number);
        return number;
    }
}
