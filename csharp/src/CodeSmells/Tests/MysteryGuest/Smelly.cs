using System.Globalization;

namespace CodeSmells.Tests.MysteryGuest.Smelly;

// SMELL (design that invites the mystery guest): the SUT can only read from a disk path,
// which forces tests to depend on external files.
public static class PriceListLoader
{
    public static IReadOnlyDictionary<string, decimal> LoadFromFile(string path) =>
        File.ReadLines(path)
            .Skip(1)
            .Select(line => line.Split(','))
            .ToDictionary(p => p[0], p => decimal.Parse(p[1], CultureInfo.InvariantCulture));
}
