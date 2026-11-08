namespace CodeSmells.CsharpSpecific.AnemicDomainModel.Smelly;

// SMELL: the entity is a bag of public getters/setters with no behaviour.
public class Order
{
    public List<OrderLine> Lines { get; set; } = new();
    public decimal Total { get; set; }
    public string Status { get; set; } = "Draft";
}

public class OrderLine
{
    public string Sku { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

// SMELL: all the business rules live in a "service" that manipulates the entity from outside.
//        Nothing prevents other code from skipping it: setting Status = "Shipped" on an empty order,
//        adding a line without recalculating Total, etc.
public class OrderService
{
    public void AddLine(Order order, string sku, int quantity, decimal unitPrice)
    {
        if (order.Status != "Draft") throw new InvalidOperationException("Order is not editable");
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        order.Lines.Add(new OrderLine { Sku = sku, Quantity = quantity, UnitPrice = unitPrice });
        order.Total = order.Lines.Sum(l => l.Quantity * l.UnitPrice);
    }

    public void Ship(Order order)
    {
        if (order.Lines.Count == 0) throw new InvalidOperationException("Cannot ship an empty order");
        order.Status = "Shipped";
    }
}
