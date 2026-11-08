using System.Globalization;
using R = CodeSmells.Comments.ObsoleteComment.Refactored;
using S = CodeSmells.Comments.ObsoleteComment.Smelly;

namespace CodeSmells.Tests.Comments;

public class ObsoleteCommentTests
{
    private static readonly DateTimeOffset Login = new(2024, 1, 15, 10, 30, 0, TimeSpan.Zero);

    [Theory]
    [InlineData(10, false)]
    [InlineData(89, false)]
    [InlineData(91, true)]
    public void Both_versions_agree_on_inactivity(int daysLater, bool expected)
    {
        var smelly = new S.UserAccount();
        var refactored = new R.UserAccount();
        smelly.RecordLogin(Login);
        refactored.RecordLogin(Login);

        var now = Login.AddDays(daysLater);

        Assert.Equal(expected, smelly.IsInactive(now));
        Assert.Equal(expected, refactored.IsInactive(now));
    }

    [Fact]
    public void Smelly_comment_lies_about_the_stored_format()
    {
        var previous = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = new CultureInfo("es-ES");
            var account = new S.UserAccount();
            account.RecordLogin(Login);

            // The comment promises MM/dd..., but in es-ES the day comes first (15/...).
            Assert.StartsWith("15/", account.LastLoginDate);
        }
        finally
        {
            CultureInfo.CurrentCulture = previous;
        }
    }

    [Fact]
    public void Refactored_keeps_the_exact_instant()
    {
        var account = new R.UserAccount();
        account.RecordLogin(Login);

        Assert.Equal(Login, account.LastLogin);
    }
}
