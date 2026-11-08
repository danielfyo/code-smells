using CodeSmells.Tests.InterdependentTests;

namespace CodeSmells.Tests.Tests.InterdependentTests;

// REFACTOR: Fresh Fixture: xUnit creates one instance of the class per test, so every test gets its
//           own repository and sets up the data it needs. Order is irrelevant; tests are isolated.
public class RefactoredTests
{
    private readonly InMemoryUserRepository _repository = new();

    [Fact]
    public void Add_stores_the_user()
    {
        _repository.Add(new User(1, "ana@shop.test"));

        Assert.Equal(1, _repository.Count);
    }

    [Fact]
    public void Find_returns_an_existing_user()
    {
        _repository.Add(new User(1, "ana@shop.test"));

        Assert.Equal("ana@shop.test", _repository.Find(1)?.Email);
    }

    [Fact]
    public void Delete_removes_an_existing_user()
    {
        _repository.Add(new User(1, "ana@shop.test"));

        Assert.True(_repository.Delete(1));
        Assert.Equal(0, _repository.Count);
    }
}
