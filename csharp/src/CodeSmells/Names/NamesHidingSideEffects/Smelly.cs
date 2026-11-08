namespace CodeSmells.Names.NamesHidingSideEffects.Smelly;

public sealed class Session(string userId)
{
    public string UserId { get; } = userId;
}

public class SessionStore
{
    private readonly Dictionary<string, Session> _sessions = new();

    public int Count => _sessions.Count;

    // SMELL: "GetSession" sounds like an innocent query, but if there is none it CREATES and STORES one.
    //        A simple "does this user have a session?" ends up opening ghost sessions.
    public Session GetSession(string userId)
    {
        if (!_sessions.TryGetValue(userId, out var session))
        {
            session = new Session(userId);
            _sessions[userId] = session;
        }
        return session;
    }
}
