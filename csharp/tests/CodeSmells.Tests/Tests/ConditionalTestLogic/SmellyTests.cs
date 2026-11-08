using CodeSmells.Tests.ConditionalTestLogic;

namespace CodeSmells.Tests.Tests.ConditionalTestLogic;

public class SmellyTests
{
    [Fact]
    public void Validates_orders()
    {
        var orders = new[]
        {
            new Order("ana@shop.test", 1, "ES"),
            new Order("bad-email", 1, "ES"),
            new Order("ana@shop.test", 0, "US"),
        };

        // SMELL: loop + if inside the test. Which cases are really checked? If the list becomes empty
        //        or the condition never holds, the test passes without verifying anything.
        foreach (var order in orders)
        {
            var errors = OrderValidator.Validate(order);
            if (order.CustomerEmail.Contains('@') && order.Quantity > 0)
            {
                Assert.Empty(errors);
            }
            else if (order.Quantity == 0)
            {
                Assert.Contains("quantity", errors);
            }
        }
    }

    [Fact]
    public void Rejects_malformed_csv()
    {
        // SMELL: try/catch in the test. If Parse does NOT throw, no assertion runs and the test passes.
        try
        {
            OrderValidator.Parse("only-two,fields");
        }
        catch (FormatException ex)
        {
            Assert.Contains("Expected", ex.Message);
        }
    }
}
