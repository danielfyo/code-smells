using R = CodeSmells.CsharpSpecific.NewInConstructor.Refactored;
using S = CodeSmells.CsharpSpecific.NewInConstructor.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class NewInConstructorTests
{
    private sealed class FakeRepository : R.IOrderRepository
    {
        public List<R.Order> Saved { get; } = new();
        public void Save(R.Order order) => Saved.Add(order);
    }

    private sealed class FakeEmailSender : R.IEmailSender
    {
        public List<string> Sent { get; } = new();
        public void Send(string to, string body) => Sent.Add($"{to}|{body}");
    }

    [Fact]
    public void Smelly_can_only_be_verified_through_global_infrastructure()
    {
        var orderId = Random.Shared.Next(100_000, 999_999); // unique id: other tests share the same "database"

        Assert.True(new S.OrderProcessor().Process(new S.Order(orderId, "ana@shop.test", 10m)));

        lock (S.SmtpEmailSender.Outbox)
        {
            Assert.Contains($"ana@shop.test|Order {orderId} received", S.SmtpEmailSender.Outbox);
        }
    }

    [Fact]
    public void Refactored_is_verified_with_isolated_fakes()
    {
        var repository = new FakeRepository();
        var email = new FakeEmailSender();

        Assert.True(new R.OrderProcessor(repository, email).Process(new R.Order(7, "ana@shop.test", 10m)));

        Assert.Single(repository.Saved);
        Assert.Equal(new[] { "ana@shop.test|Order 7 received" }, email.Sent);
    }

    [Fact]
    public void Both_reject_invalid_orders()
    {
        Assert.False(new S.OrderProcessor().Process(new S.Order(1, "a@b.c", 0m)));
        Assert.False(new R.OrderProcessor(new FakeRepository(), new FakeEmailSender()).Process(new R.Order(1, "a@b.c", 0m)));
    }
}
