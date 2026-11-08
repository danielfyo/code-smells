using CodeSmells.Tests.ConditionalTestLogic;

namespace CodeSmells.Tests.Tests.ConditionalTestLogic;

// REFACTOR: no conditional logic in tests. Each case is a data row with its explicit expected
//           result, and exceptions are checked with Assert.Throws (which FAILS if nothing is thrown).
public class RefactoredTests
{
    [Theory]
    [InlineData("ana@shop.test", 1, "ES", new string[0])]
    [InlineData("bad-email", 1, "ES", new[] { "email" })]
    [InlineData("ana@shop.test", 0, "US", new[] { "quantity", "country" })]
    [InlineData("ana@shop.test", 101, "PT", new[] { "quantity" })]
    public void Validate_reports_every_broken_rule(string email, int quantity, string country, string[] expected) =>
        Assert.Equal(expected, OrderValidator.Validate(new Order(email, quantity, country)));

    [Fact]
    public void Parse_rejects_malformed_csv()
    {
        var ex = Assert.Throws<FormatException>(() => OrderValidator.Parse("only-two,fields"));
        Assert.Contains("Expected", ex.Message);
    }
}
