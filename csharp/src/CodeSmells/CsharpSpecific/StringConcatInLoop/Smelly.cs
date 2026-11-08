namespace CodeSmells.CsharpSpecific.StringConcatInLoop.Smelly;

public sealed record Order(int Id, string Customer, decimal Amount);

public static class OrderCsv
{
    // SMELL: string is immutable: every "+=" creates a new string copying everything before it.
    //        With N orders that is O(N²) characters copied and thousands of objects for the GC.
    public static string Build(IEnumerable<Order> orders)
    {
        var csv = "id;customer;amount\n";
        foreach (var order in orders)
        {
            csv += order.Id + ";" + order.Customer + ";" + order.Amount.ToString("0.00") + "\n";
        }
        return csv;
    }
}
