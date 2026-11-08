using Microsoft.Extensions.DependencyInjection;
using R = CodeSmells.CsharpSpecific.ServiceLocator.Refactored;
using S = CodeSmells.CsharpSpecific.ServiceLocator.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class ServiceLocatorTests
{
    private sealed class Pricing : S.IPricingService, R.IPricingService
    {
        public decimal PriceOf(string sku) => sku == "BOOK" ? 20m : 5m;
    }

    private sealed class Receipts : S.IReceiptSender, R.IReceiptSender
    {
        public List<(string, decimal)> Sent { get; } = new();
        public void Send(string customer, decimal total) => Sent.Add((customer, total));
    }

    [Fact]
    public void Smelly_needs_global_container_setup_and_both_versions_agree()
    {
        var smellyReceipts = new Receipts();
        var services = new ServiceCollection()
            .AddSingleton<S.IPricingService, Pricing>()
            .AddSingleton<S.IReceiptSender>(smellyReceipts);
        var previous = S.ServiceLocator.Provider;
        S.ServiceLocator.Provider = services.BuildServiceProvider(); // global state!
        try
        {
            var refactoredReceipts = new Receipts();

            var smellyTotal = new S.CheckoutService().Checkout("ana", new[] { "BOOK", "PEN" });
            var refactoredTotal = new R.CheckoutService(new Pricing(), refactoredReceipts).Checkout("ana", new[] { "BOOK", "PEN" });

            Assert.Equal(25m, smellyTotal);
            Assert.Equal(smellyTotal, refactoredTotal);
            Assert.Equal(smellyReceipts.Sent, refactoredReceipts.Sent);
        }
        finally
        {
            S.ServiceLocator.Provider = previous;
        }
    }

    [Fact]
    public void Smelly_missing_registration_is_only_found_at_run_time()
    {
        var previous = S.ServiceLocator.Provider;
        S.ServiceLocator.Provider = new ServiceCollection().BuildServiceProvider();
        try
        {
            Assert.Throws<InvalidOperationException>(() => new S.CheckoutService().Checkout("ana", new[] { "BOOK" }));
        }
        finally
        {
            S.ServiceLocator.Provider = previous;
        }
    }

    [Fact]
    public void Refactored_works_with_a_container_too()
    {
        using var provider = new ServiceCollection()
            .AddSingleton<R.IPricingService, Pricing>()
            .AddSingleton<R.IReceiptSender, Receipts>()
            .AddTransient<R.CheckoutService>()
            .BuildServiceProvider();

        Assert.Equal(20m, provider.GetRequiredService<R.CheckoutService>().Checkout("ana", new[] { "BOOK" }));
    }
}
