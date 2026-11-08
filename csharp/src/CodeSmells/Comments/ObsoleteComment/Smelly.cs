using System.Globalization;

namespace CodeSmells.Comments.ObsoleteComment.Smelly;

public class UserAccount
{
    //Last login date as String (MM/dd/YYY/ HH:mm:ss)
    // SMELL: the comment lies. The real format depends on the thread culture (DateTimeOffset.ToString()),
    //        it is not "MM/dd/YYY/ HH:mm:ss" (which has typos anyway). Someone changed the code, not the comment.
    public string LastLoginDate = DateTimeOffset.Now.ToString();

    // Stores the date in UTC
    // SMELL: false: it stores the date as it arrives, with its original offset.
    public void RecordLogin(DateTimeOffset at) => LastLoginDate = at.ToString();

    // Inactive after 30 days
    // SMELL: the code uses 90; the comment became obsolete after a business change.
    public bool IsInactive(DateTimeOffset now) =>
        now - DateTimeOffset.Parse(LastLoginDate, CultureInfo.CurrentCulture) > TimeSpan.FromDays(90);
}
