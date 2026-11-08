namespace CodeSmells.Tests.InterdependentTests;

// Production code. The "Interdependent Tests" smell lives in tests/CodeSmells.Tests/Tests/InterdependentTests/.
public sealed record User(int Id, string Email);

public class InMemoryUserRepository
{
    private readonly Dictionary<int, User> _users = new();

    public int Count => _users.Count;

    public void Add(User user)
    {
        if (!_users.TryAdd(user.Id, user)) throw new InvalidOperationException($"User {user.Id} already exists");
    }

    public User? Find(int id) => _users.GetValueOrDefault(id);

    public bool Delete(int id) => _users.Remove(id);
}
