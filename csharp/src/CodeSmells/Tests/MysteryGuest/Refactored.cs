using System.Globalization;

namespace CodeSmells.Tests.MysteryGuest.Refactored;

// REFACTOR: parsing works on a TextReader. Reading from disk is a thin layer on top,
//           and tests can pass the content inline, visible in the test itself.
public static class PriceListLoader
{
    public static IReadOnlyDictionary<string, decimal> Parse(TextReader reader)
    {
        var prices = new Dictionary<string, decimal>();
        reader.ReadLine(); // header
        while (reader.ReadLine() is { } line)
        {
            var parts = line.Split(',');
            prices[parts[0]] = decimal.Parse(parts[1], CultureInfo.InvariantCulture);
        }
        return prices;
    }

    public static IReadOnlyDictionary<string, decimal> LoadFromFile(string path)
    {
        using var reader = File.OpenText(path);
        return Parse(reader);
    }
}
