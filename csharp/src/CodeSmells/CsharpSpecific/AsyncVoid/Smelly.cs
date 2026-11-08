namespace CodeSmells.CsharpSpecific.AsyncVoid.Smelly;

public interface IMailGateway
{
    Task SendAsync(string to, string subject);
}

public class WelcomeMailer(IMailGateway gateway)
{
    // SMELL: async void outside an event handler.
    //  - The caller gets no Task: it cannot wait for completion nor know whether it succeeded.
    //  - If it throws, the exception does NOT reach the caller: it is rethrown on the SynchronizationContext
    //    (or on the thread pool if there is none), where it usually crashes the process.
    public async void SendWelcomeAsync(string email)
    {
        if (!email.Contains('@'))
        {
            throw new ArgumentException($"Invalid email '{email}'", nameof(email));
        }

        await gateway.SendAsync(email, "Welcome to the shop!");
    }
}
