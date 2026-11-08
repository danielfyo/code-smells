using R = CodeSmells.ErrorHandling.SwallowedExceptions.Refactored;
using S = CodeSmells.ErrorHandling.SwallowedExceptions.Smelly;

namespace CodeSmells.Tests.ErrorHandling;

public class SwallowedExceptionsTests
{
    [Fact]
    public void Successful_transfer_behaves_the_same()
    {
        var (sa, sb) = (new S.Account("A", 100m), new S.Account("B", 0m));
        var (ra, rb) = (new R.Account("A", 100m), new R.Account("B", 0m));
        new S.TransferService().Transfer(sa, sb, 40m);
        new R.TransferService().Transfer(ra, rb, 40m);
        Assert.Equal((sa.Balance, sb.Balance), (ra.Balance, rb.Balance));
    }

    [Fact]
    public void Smelly_loses_money_silently_when_credit_fails()
    {
        var from = new S.Account("A", 100m);
        var frozen = new S.Account("B", 0m, isFrozen: true);
        new S.TransferService().Transfer(from, frozen, 40m); // no error reported
        Assert.Equal(60m, from.Balance);
        Assert.Equal(0m, frozen.Balance); // 40 vanished
    }

    [Fact]
    public void Refactored_compensates_and_reports_the_failure()
    {
        var from = new R.Account("A", 100m);
        var frozen = new R.Account("B", 0m, isFrozen: true);
        var ex = Assert.Throws<R.TransferFailedException>(() => new R.TransferService().Transfer(from, frozen, 40m));
        Assert.IsType<InvalidOperationException>(ex.InnerException);
        Assert.Equal(100m, from.Balance);
    }
}
