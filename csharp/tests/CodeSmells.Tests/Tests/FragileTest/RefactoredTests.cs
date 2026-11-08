using CodeSmells.Tests.FragileTest;

namespace CodeSmells.Tests.Tests.FragileTest;

// REFACTOR: observable behaviour is tested through the public API. Internal details
//           can be reorganized freely as long as the final price stays correct.
public class RefactoredTests
{
    private readonly PriceCalculator _calculator = new();

    [Theory]
    [InlineData(10, 9, false, 90)]   // no volume discount
    [InlineData(10, 10, false, 90)]  // 10% volume discount
    [InlineData(10, 10, true, 85)]   // volume + member
    [InlineData(2, 1, true, 0)]      // never negative
    public void Computes_final_price(decimal basePrice, int quantity, bool isMember, decimal expected) =>
        Assert.Equal(expected, _calculator.FinalPrice(basePrice, quantity, isMember));
}
