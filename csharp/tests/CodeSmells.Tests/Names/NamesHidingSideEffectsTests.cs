using S = CodeSmells.Names.NamesHidingSideEffects.Smelly;
using R = CodeSmells.Names.NamesHidingSideEffects.Refactored;

namespace CodeSmells.Tests.Names;

public class NamesHidingSideEffectsTests
{
    [Fact]
    public void Smelly_getter_silently_creates_sessions()
    {
        var store = new S.SessionStore();

        var hasSession = store.GetSession("ana") is not null; // looks like a simple query...

        Assert.True(hasSession);
        Assert.Equal(1, store.Count); // ...but it created a session
    }

    [Fact]
    public void Refactored_query_has_no_side_effects()
    {
        var store = new R.SessionStore();

        Assert.Null(store.FindSession("ana"));
        Assert.Equal(0, store.Count);
    }

    [Fact]
    public void GetOrCreate_behaves_like_the_smelly_getter()
    {
        var smelly = new S.SessionStore();
        var refactored = new R.SessionStore();

        Assert.Same(smelly.GetSession("ana"), smelly.GetSession("ana"));
        Assert.Same(refactored.GetOrCreateSession("ana"), refactored.GetOrCreateSession("ana"));
        Assert.Equal(smelly.Count, refactored.Count);
    }
}
