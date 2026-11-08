using S = CodeSmells.General.TooMuchInformation.Smelly;
using R = CodeSmells.General.TooMuchInformation.Refactored;

namespace CodeSmells.Tests.General;

public class TooMuchInformationTests
{
    [Fact]
    public void Both_accounts_behave_the_same()
    {
        var smelly = new S.BankAccount();
        var refactored = new R.BankAccount();

        smelly.Deposit(100); refactored.Deposit(100);
        smelly.Withdraw(30); refactored.Withdraw(30);

        Assert.Equal(70m, smelly.Balance);
        Assert.Equal(smelly.Balance, refactored.Balance);
        Assert.Equal(smelly.Movements, refactored.Movements);
        Assert.Throws<InvalidOperationException>(() => smelly.Withdraw(1000));
        Assert.Throws<InvalidOperationException>(() => refactored.Withdraw(1000));
    }

    [Fact]
    public void Smelly_account_lets_clients_break_its_invariants()
    {
        var smelly = new S.BankAccount();
        smelly.Deposit(10);

        smelly.Balance = 1_000_000m; // nothing prevents it

        Assert.NotEqual(smelly.Movements.Sum(), smelly.Balance);
    }

    [Fact]
    public void Refactored_account_exposes_a_narrow_api()
    {
        var publicMethods = typeof(R.BankAccount).GetMethods()
            .Where(m => m.DeclaringType == typeof(R.BankAccount) && !m.IsSpecialName)
            .Select(m => m.Name)
            .OrderBy(n => n);

        Assert.Equal(new[] { "Deposit", "Withdraw" }, publicMethods);
    }
}
