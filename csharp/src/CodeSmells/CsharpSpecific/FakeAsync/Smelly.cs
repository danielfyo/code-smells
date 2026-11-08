namespace CodeSmells.CsharpSpecific.FakeAsync.Smelly;

public sealed record InvoiceLine(decimal Amount, string Category);

public class InvoiceLibrary
{
    // SMELL: "fake async" in a library. A purely CPU-bound calculation is wrapped in Task.Run just to
    //        offer an ...Async method. It does not make anything faster: it consumes a thread-pool thread,
    //        adds overhead, and takes away from the CALLER the decision of whether to offload work
    //        (in ASP.NET Core it only moves the work from one pool thread to another).
    public Task<decimal> CalculateTaxAsync(IEnumerable<InvoiceLine> lines) =>
        Task.Run(() => lines.Sum(l => l.Amount * (l.Category == "food" ? 0.10m : 0.21m)));

    // SMELL: fake asynchronous I/O: synchronous blocking read wrapped in Task.Run. A thread is still
    //        blocked waiting for the I/O; it is just a different one.
    public Task<string> ReadTemplateAsync(Stream source) =>
        Task.Run(() => new StreamReader(source).ReadToEnd());
}
