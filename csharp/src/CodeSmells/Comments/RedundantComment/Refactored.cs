namespace CodeSmells.Comments.RedundantComment.Refactored;

// REFACTOR: the comments that repeated the code are removed. The names and the LINQ expression
//           tell the story on their own; only one comment remains, explaining a "why".
public class ShoppingCart
{
    private readonly List<CartItem> _items = new();

    public void Add(string sku, decimal price, int quantity) => _items.Add(new CartItem(sku, price, quantity));

    public decimal Total() => _items.Sum(item => item.Subtotal);

    // Counts units, not lines: that is what the cart badge in the shop displays.
    public int Count => _items.Sum(item => item.Quantity);

    private sealed record CartItem(string Sku, decimal Price, int Quantity)
    {
        public decimal Subtotal => Price * Quantity;
    }
}
