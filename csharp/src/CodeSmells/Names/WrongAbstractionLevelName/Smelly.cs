namespace CodeSmells.Names.WrongAbstractionLevelName.Smelly;

// SMELL: the high-level interface is named after ONE concrete implementation (SMTP).
//        If tomorrow we notify by SMS or push, the name will lie or every client will have to break.
public interface ISmtpMailer
{
    void SendSmtpEmail(string emailAddress, string body);
}

public class OrderService(ISmtpMailer mailer)
{
    // SMELL: the order service reasons in terms of "SMTP email" when what it cares about is
    //        "letting the customer know". The name is at the wrong level of abstraction.
    public void ConfirmOrder(string customerContact, int orderId) =>
        mailer.SendSmtpEmail(customerContact, $"Your order #{orderId} is confirmed");
}

public class RecordingSmtpMailer : ISmtpMailer
{
    public List<(string To, string Body)> Sent { get; } = new();
    public void SendSmtpEmail(string emailAddress, string body) => Sent.Add((emailAddress, body));
}
