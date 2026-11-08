namespace CodeSmells.CsharpSpecific.FakeAsync.Refactored;

public sealed record InvoiceLine(decimal Amount, string Category);

public class InvoiceLibrary
{
    // REFACTOR: CPU-bound work is exposed as a synchronous method. If a UI caller needs to keep its
    //           thread free, IT can write await Task.Run(() => library.CalculateTax(lines)).
    public decimal CalculateTax(IEnumerable<InvoiceLine> lines) =>
        lines.Sum(l => l.Amount * (l.Category == "food" ? 0.10m : 0.21m));

    // REFACTOR: real asynchronous I/O using the async APIs of the framework: no thread is blocked
    //           while waiting for data.
    public async Task<string> ReadTemplateAsync(Stream source)
    {
        using var reader = new StreamReader(source);
        return await reader.ReadToEndAsync().ConfigureAwait(false);
    }
}
