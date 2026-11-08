using System.Text;

namespace CodeSmells.CsharpSpecific.StringConcatInLoop.Refactored;

public sealed record Order(int Id, string Customer, decimal Amount);

public static class OrderCsv
{
    // REFACTOR: StringBuilder appends to a growable buffer: O(N) and a single final string.
    public static string Build(IEnumerable<Order> orders)
    {
        var csv = new StringBuilder("id;customer;amount\n");
        foreach (var order in orders)
        {
            csv.Append(order.Id).Append(';')
               .Append(order.Customer).Append(';')
               .Append(order.Amount.ToString("0.00")).Append('\n');
        }
        return csv.ToString();
    }

    // REFACTOR (alternative): when each line is a projection, string.Join/Concat is even more direct.
    public static string BuildWithJoin(IEnumerable<Order> orders) =>
        "id;customer;amount\n" +
        string.Concat(orders.Select(o => $"{o.Id};{o.Customer};{o.Amount:0.00}\n"));
}
