namespace CodeSmells.Comments.RedundantComment.Smelly;

/// <summary>
/// ShoppingCart class.
/// </summary>
// SMELL: the XML comment repeats the class name without adding anything.
public class ShoppingCart
{
    // The list of products
    // SMELL: the field name already says so.
    private readonly List<(string Sku, decimal Price, int Quantity)> _items = new();

    /// <summary>Adds an item.</summary>
    /// <param name="sku">The sku.</param>
    /// <param name="price">The price.</param>
    /// <param name="quantity">The quantity.</param>
    // SMELL: "fill-in-the-blanks" documentation written out of obligation: it paraphrases the signature.
    public void Add(string sku, decimal price, int quantity)
    {
        // Add the item to the list
        _items.Add((sku, price, quantity)); // SMELL: comment narrating the line of code.
    }

    // Returns the total
    public decimal Total()
    {
        // Initialize the total to zero
        decimal total = 0;
        // Loop through the items
        foreach (var item in _items)
        {
            // Add price times quantity to the total
            total += item.Price * item.Quantity;
        }
        // Return the total
        return total;
        // SMELL: every comment translates into prose what the code already expresses; it is noise the reader
        //        learns to ignore (and, with it, the comments that do matter).
    }

    // Returns the number of items
    public int Count => _items.Sum(i => i.Quantity);
}
