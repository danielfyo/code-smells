using S = CodeSmells.General.MissingExplanatoryVariables.Smelly;
using R = CodeSmells.General.MissingExplanatoryVariables.Refactored;

namespace CodeSmells.Tests.General;

public class MissingExplanatoryVariablesTests
{
    private static readonly DateOnly Today = new(2024, 6, 1);

    [Theory]
    [InlineData(2020, 10, false, 10, "Books", true)]      // loyal customer
    [InlineData(2024, 0, false, 80, "Books", true)]       // large, light order
    [InlineData(2024, 0, false, 80, "Furniture", false)]  // bulky items
    [InlineData(2020, 10, true, 100, "Books", false)]     // unpaid invoices
    [InlineData(2023, 10, false, 10, "Books", false)]     // not a customer long enough
    public void Both_policies_agree(int signupYear, int orders, bool unpaid, decimal total, string category, bool expected)
    {
        var signup = new DateOnly(signupYear, 1, 1);
        var smelly = S.FreeShippingPolicy.Qualifies(new S.Customer(signup, orders, unpaid), new S.Cart(total, new[] { category }), Today);
        var refactored = R.FreeShippingPolicy.Qualifies(new R.Customer(signup, orders, unpaid), new R.Cart(total, new[] { category }), Today);

        Assert.Equal(expected, smelly);
        Assert.Equal(smelly, refactored);
    }

    [Fact]
    public void Both_parse_order_codes_alike()
    {
        Assert.Equal(("ES", 2024, 123), S.FreeShippingPolicy.ParseOrderCode("ES-2024-000123"));
        Assert.Equal(S.FreeShippingPolicy.ParseOrderCode("ES-2024-000123"), R.FreeShippingPolicy.ParseOrderCode("ES-2024-000123"));
    }
}
