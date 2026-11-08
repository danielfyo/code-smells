using S = CodeSmells.CsharpSpecific.AsyncVoid.Smelly;
using R = CodeSmells.CsharpSpecific.AsyncVoid.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class AsyncVoidTests
{
    private sealed class Gateway : S.IMailGateway, R.IMailGateway
    {
        public List<string> Sent { get; } = new();
        public Task SendAsync(string to, string subject) { Sent.Add(to); return Task.CompletedTask; }
    }

    // Context that captures what async void "posts" to it, so it can be observed without crashing the test host.
    private sealed class RecordingContext : SynchronizationContext
    {
        private readonly Queue<(SendOrPostCallback Callback, object? State)> _posted = new();
        public override void Post(SendOrPostCallback d, object? state) => _posted.Enqueue((d, state));

        public List<Exception> RunPosted()
        {
            var errors = new List<Exception>();
            while (_posted.TryDequeue(out var item))
            {
                try { item.Callback(item.State); }
                catch (Exception ex) { errors.Add(ex); }
            }
            return errors;
        }
    }

    [Fact]
    public void Smelly_exception_never_reaches_the_caller()
    {
        var mailer = new S.WelcomeMailer(new Gateway());
        var context = new RecordingContext();
        var previous = SynchronizationContext.Current;
        Exception? seenByCaller;

        SynchronizationContext.SetSynchronizationContext(context);
        try
        {
            seenByCaller = Record.Exception(() => mailer.SendWelcomeAsync("not-an-email"));
        }
        finally
        {
            SynchronizationContext.SetSynchronizationContext(previous);
        }

        Assert.Null(seenByCaller); // the caller's try/catch would have been useless...
        var escaped = Assert.Single(context.RunPosted());
        Assert.IsType<ArgumentException>(escaped); // ...the exception ended up in the context (in production: a crash)
    }

    [Fact]
    public async Task Refactored_exception_is_observable_by_the_caller()
    {
        var mailer = new R.WelcomeMailer(new Gateway());

        await Assert.ThrowsAsync<ArgumentException>(() => mailer.SendWelcomeAsync("not-an-email"));
    }

    [Fact]
    public async Task Both_send_the_welcome_email_on_valid_input()
    {
        var smellyGateway = new Gateway();
        var refactoredGateway = new Gateway();

        new S.WelcomeMailer(smellyGateway).SendWelcomeAsync("ana@shop.test"); // cannot be awaited
        await new R.WelcomeMailer(refactoredGateway).SendWelcomeAsync("ana@shop.test");

        Assert.Equal(new[] { "ana@shop.test" }, smellyGateway.Sent);
        Assert.Equal(smellyGateway.Sent, refactoredGateway.Sent);
    }
}
