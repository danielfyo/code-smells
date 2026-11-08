using Microsoft.Extensions.DependencyInjection;

namespace CodeSmells.CsharpSpecific.ServiceLocator.Smelly;

public interface IPricingService { decimal PriceOf(string sku); }
public interface IReceiptSender { void Send(string customer, decimal total); }

// SMELL: a global, static access point to the container.
public static class ServiceLocator
{
    public static IServiceProvider? Provider { get; set; }
}

public class CheckoutService
{
    // SMELL: the constructor says "I need nothing", which is a lie. The real dependencies are hidden in the
    //        method body and are only discovered at run time (InvalidOperationException/NullReferenceException
    //        if someone forgot to register them). Tests must configure global state shared by every test.
    public decimal Checkout(string customer, IEnumerable<string> skus)
    {
        var pricing = ServiceLocator.Provider!.GetRequiredService<IPricingService>();
        var receipts = ServiceLocator.Provider!.GetRequiredService<IReceiptSender>();

        var total = skus.Sum(pricing.PriceOf);
        receipts.Send(customer, total);
        return total;
    }
}
