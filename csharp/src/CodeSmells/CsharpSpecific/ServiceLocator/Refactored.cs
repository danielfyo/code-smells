namespace CodeSmells.CsharpSpecific.ServiceLocator.Refactored;

public interface IPricingService { decimal PriceOf(string sku); }
public interface IReceiptSender { void Send(string customer, decimal total); }

// REFACTOR: constructor injection. The signature documents exactly what the class needs, the container
//           (if any) is used only at the composition root, and tests just pass plain fakes.
public class CheckoutService(IPricingService pricing, IReceiptSender receipts)
{
    public decimal Checkout(string customer, IEnumerable<string> skus)
    {
        var total = skus.Sum(pricing.PriceOf);
        receipts.Send(customer, total);
        return total;
    }
}
