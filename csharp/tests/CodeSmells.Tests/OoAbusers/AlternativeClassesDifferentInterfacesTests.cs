using S = CodeSmells.OoAbusers.AlternativeClassesDifferentInterfaces.Smelly;
using R = CodeSmells.OoAbusers.AlternativeClassesDifferentInterfaces.Refactored;

namespace CodeSmells.Tests.OoAbusers;

public class AlternativeClassesDifferentInterfacesTests
{
    [Theory]
    [InlineData("ana@shop.es", null)]
    [InlineData(null, "+34600111222")]
    [InlineData("eva@shop.es", "+34600333444")]
    public void Both_send_the_same_messages(string? email, string? phone)
    {
        var sEmail = new S.EmailSender();
        var sSms = new S.SmsGateway();
        new S.ShipmentNotifier(sEmail, sSms).NotifyDispatched(new S.Customer { Name = "Cli", Email = email, Phone = phone }, "TRK1");

        var rEmail = new R.EmailChannel();
        var rSms = new R.SmsChannel();
        new R.ShipmentNotifier([rEmail, rSms]).NotifyDispatched(new R.Customer("Cli", email, phone), "TRK1");

        Assert.Equal(sEmail.Outbox, rEmail.Outbox);
        Assert.Equal(sSms.Log, rSms.Log);
    }
}
