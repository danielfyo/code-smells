namespace CodeSmells.Names.NamesHidingSideEffects.Refactored;

public sealed class Session(string userId)
{
    public string UserId { get; } = userId;
}

public class SessionStore
{
    private readonly Dictionary<string, Session> _sessions = new();

    public int Count => _sessions.Count;

    // REFACTOR: Separate Query from Modifier: the pure query changes nothing...
    public Session? FindSession(string userId) => _sessions.GetValueOrDefault(userId);

    // REFACTOR: ...and when the side effect is wanted, the name announces it (GetOrAdd/GetOrCreate convention).
    public Session GetOrCreateSession(string userId)
    {
        if (!_sessions.TryGetValue(userId, out var session))
        {
            session = new Session(userId);
            _sessions[userId] = session;
        }
        return session;
    }
}
