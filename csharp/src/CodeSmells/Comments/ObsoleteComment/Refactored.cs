namespace CodeSmells.Comments.ObsoleteComment.Refactored;

public class UserAccount
{
    // REFACTOR: instead of a string whose format is "documented" in a comment, the right type is used.
    //           DateTimeOffset needs no comment: the type says what it is and cannot become outdated.
    public DateTimeOffset LastLogin { get; private set; } = DateTimeOffset.Now;

    // REFACTOR: the business rule moves from a (lying) comment to a named constant.
    public static readonly TimeSpan InactivityThreshold = TimeSpan.FromDays(90);

    public void RecordLogin(DateTimeOffset at) => LastLogin = at;

    public bool IsInactive(DateTimeOffset now) => now - LastLogin > InactivityThreshold;
}
