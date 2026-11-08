namespace CodeSmells.CsharpSpecific.MissingDispose.Smelly;

public sealed record Order(int Id, decimal Amount);

public class OrderCsvExporter
{
    // SMELL: StreamWriter is IDisposable and is never disposed. Besides the leak, its internal buffer
    //        is never flushed: the data may never reach the output stream!
    public void Export(IEnumerable<Order> orders, Stream output)
    {
        var writer = new StreamWriter(output, leaveOpen: true);
        writer.WriteLine("id,amount");
        foreach (var order in orders)
        {
            writer.WriteLine($"{order.Id},{order.Amount}");
        }
    }

    // SMELL: manual Dispose at the end: if something throws halfway, it never runs and the resource stays open.
    public int CountLines(Func<Stream> openFile)
    {
        var reader = new StreamReader(openFile());
        var count = 0;
        while (reader.ReadLine() is { } line)
        {
            if (line.Length == 0) throw new InvalidDataException("Empty line");
            count++;
        }
        reader.Dispose();
        return count;
    }
}
