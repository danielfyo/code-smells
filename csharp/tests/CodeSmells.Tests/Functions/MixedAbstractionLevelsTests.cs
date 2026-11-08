using S = CodeSmells.Functions.MixedAbstractionLevels.Smelly;
using R = CodeSmells.Functions.MixedAbstractionLevels.Refactored;

namespace CodeSmells.Tests.Functions;

public class MixedAbstractionLevelsTests
{
    [Fact]
    public void Same_user_and_email_are_produced()
    {
        var s = new S.RegistrationService();
        var r = new R.RegistrationService();
        s.Register(" Lucia@Mail.Test ", "sunshine123");
        r.Register(" Lucia@Mail.Test ", "sunshine123");
        Assert.Equal(s.Users["lucia@mail.test"], new S.User(r.Users["lucia@mail.test"].Email, r.Users["lucia@mail.test"].PasswordHash));
        Assert.Equal(s.Outbox, r.Outbox);
    }

    [Fact]
    public void Same_validation_errors()
    {
        var s = new S.RegistrationService();
        var r = new R.RegistrationService();
        Assert.Throws<ArgumentException>(() => s.Register("a@b.c", "nodigitshere"));
        Assert.Throws<ArgumentException>(() => r.Register("a@b.c", "nodigitshere"));
        s.Register("a@b.c", "password1");
        r.Register("a@b.c", "password1");
        Assert.Throws<InvalidOperationException>(() => s.Register("A@B.C", "password2"));
        Assert.Throws<InvalidOperationException>(() => r.Register("A@B.C", "password2"));
    }
}
