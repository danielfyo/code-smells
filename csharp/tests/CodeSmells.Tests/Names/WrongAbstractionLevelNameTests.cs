using S = CodeSmells.Names.WrongAbstractionLevelName.Smelly;
using R = CodeSmells.Names.WrongAbstractionLevelName.Refactored;

namespace CodeSmells.Tests.Names;

public class WrongAbstractionLevelNameTests
{
    [Fact]
    public void Both_services_send_the_same_confirmation()
    {
        var mailer = new S.RecordingSmtpMailer();
        var notifier = new R.RecordingEmailNotifier();

        new S.OrderService(mailer).ConfirmOrder("ana@shop.test", 42);
        new R.OrderService(notifier).ConfirmOrder("ana@shop.test", 42);

        Assert.Equal(("ana@shop.test", "Your order #42 is confirmed"), Assert.Single(mailer.Sent));
        Assert.Equal(mailer.Sent, notifier.Sent);
    }
}
