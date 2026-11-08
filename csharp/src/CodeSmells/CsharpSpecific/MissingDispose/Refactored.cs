namespace CodeSmells.CsharpSpecific.MissingDispose.Refactored;

public sealed record Order(int Id, decimal Amount);

public class OrderCsvExporter
{
    // REFACTOR: "using var" declaration: the writer is disposed (and flushes its buffer) when leaving the scope,
    //           no matter what. Analyzers CA2000/IDE0063 help detect the omission.
    public void Export(IEnumerable<Order> orders, Stream output)
    {
        using var writer = new StreamWriter(output, leaveOpen: true);
        writer.WriteLine("id,amount");
        foreach (var order in orders)
        {
            writer.WriteLine($"{order.Id},{order.Amount}");
        }
    }

    // REFACTOR: using guarantees Dispose also when an exception is thrown (implicit try/finally).
    public int CountLines(Func<Stream> openFile)
    {
        using var reader = new StreamReader(openFile());
        var count = 0;
        while (reader.ReadLine() is { } line)
        {
            if (line.Length == 0)
            {
                throw new InvalidDataException("Empty line");
            }

            count++;
        }
        return count;
    }
}
