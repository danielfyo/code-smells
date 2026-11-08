namespace CodeSmells.CsharpSpecific.AsyncVoid.Refactored;

public interface IMailGateway
{
    Task SendAsync(string to, string subject);
}

public class WelcomeMailer(IMailGateway gateway)
{
    // REFACTOR: async Task. The caller can await it, compose it with Task.WhenAll and, above all,
    //           catch exceptions with a normal try/catch. "async void" is reserved for
    //           event handlers (and even then, wrapping their body in try/catch).
    public async Task SendWelcomeAsync(string email)
    {
        if (!email.Contains('@'))
        {
            throw new ArgumentException($"Invalid email '{email}'", nameof(email));
        }

        await gateway.SendAsync(email, "Welcome to the shop!");
    }
}
