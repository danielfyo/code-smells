using R = CodeSmells.Bloaters.LargeClass.Refactored;
using S = CodeSmells.Bloaters.LargeClass.Smelly;

namespace CodeSmells.Tests.Bloaters;

public class LargeClassTests
{
    private static readonly DateOnly Day0 = new(2024, 3, 1);

    [Fact]
    public void Both_versions_charge_the_same_fine_and_notify_the_same()
    {
        var smelly = new S.LibraryManager();
        smelly.AddMember("m1", "Eva");
        smelly.AddBook("isbn1", "Dune");
        smelly.Lend("isbn1", "m1", Day0);
        smelly.Return("isbn1", Day0.AddDays(17));

        var members = new R.MemberRegistry();
        members.Add("m1", "Eva");
        var catalog = new R.Catalog();
        catalog.Add("isbn1", "Dune");
        var fines = new R.FineLedger();
        var notifier = new R.Notifier();
        var service = new R.LibraryService(members, catalog, fines, new R.FinePolicy(), notifier);
        service.Lend("isbn1", "m1", Day0);
        service.Return("isbn1", Day0.AddDays(17));

        Assert.Equal(0.75m, smelly.FineOf("m1"));
        Assert.Equal(smelly.FineOf("m1"), fines.Of("m1"));
        Assert.Equal(smelly.SentNotifications, notifier.Sent);
    }

    [Fact]
    public void Both_block_loans_with_pending_fines()
    {
        var smelly = new S.LibraryManager();
        smelly.AddMember("m1", "Eva");
        smelly.AddBook("a", "A");
        smelly.AddBook("b", "B");
        smelly.Lend("a", "m1", Day0);
        smelly.Return("a", Day0.AddDays(20));
        Assert.Throws<InvalidOperationException>(() => smelly.Lend("b", "m1", Day0));

        var members = new R.MemberRegistry(); members.Add("m1", "Eva");
        var catalog = new R.Catalog(); catalog.Add("a", "A"); catalog.Add("b", "B");
        var service = new R.LibraryService(members, catalog, new R.FineLedger(), new R.FinePolicy(), new R.Notifier());
        service.Lend("a", "m1", Day0);
        service.Return("a", Day0.AddDays(20));
        Assert.Throws<InvalidOperationException>(() => service.Lend("b", "m1", Day0));
    }

    [Fact]
    public void Fine_policy_is_testable_alone()
    {
        Assert.Equal(0m, new R.FinePolicy().For(-3));
        Assert.Equal(1.5m, new R.FinePolicy(0.5m).For(3));
    }
}
