using S = CodeSmells.Names.BinaryOperatorInName.Smelly;
using R = CodeSmells.Names.BinaryOperatorInName.Refactored;

namespace CodeSmells.Tests.Names;

public class BinaryOperatorInNameTests
{
    [Theory]
    [InlineData("ana@shop.test", 10, 0)]
    [InlineData("ana", 10, 1)]
    [InlineData("ana", -1, 2)]
    public void Both_versions_validate_and_persist_alike(string email, decimal amount, int expectedErrors)
    {
        var smelly = new S.OrderService();
        var repository = new R.OrderRepository();

        var smellyErrors = smelly.ValidateAndSave(new S.Order(1, email, amount));
        var refactoredErrors = new R.PlaceOrderHandler(repository).Handle(new R.Order(1, email, amount));

        Assert.Equal(expectedErrors, smellyErrors.Count);
        Assert.Equal(smellyErrors, refactoredErrors);
        Assert.Equal(smelly.Saved.Count, repository.Saved.Count);
    }

    [Fact]
    public void Refactored_allows_validating_without_saving()
    {
        var errors = R.OrderValidator.Validate(new R.Order(1, "ana@shop.test", 10));
        Assert.Empty(errors);
    }
}
