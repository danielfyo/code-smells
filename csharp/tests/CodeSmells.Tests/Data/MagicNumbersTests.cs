using S = CodeSmells.Data.MagicNumbers.Smelly;
using R = CodeSmells.Data.MagicNumbers.Refactored;

namespace CodeSmells.Tests.Data;

public class MagicNumbersTests
{
    [Theory]
    [InlineData(10, "C", R.VehicleType.Car, false)]
    [InlineData(61, "C", R.VehicleType.Car, false)]
    [InlineData(200, "M", R.VehicleType.Motorbike, false)]
    [InlineData(200, "R", R.VehicleType.Caravan, false)]
    [InlineData(600, "R", R.VehicleType.Caravan, true)]
    [InlineData(600, "C", R.VehicleType.Car, true)]
    public void Fees_match(int minutes, string code, R.VehicleType type, bool weekend)
    {
        Assert.Equal(S.ParkingFeeCalculator.Fee(minutes, code, weekend), R.ParkingFeeCalculator.Fee(minutes, type, weekend));
    }
}
