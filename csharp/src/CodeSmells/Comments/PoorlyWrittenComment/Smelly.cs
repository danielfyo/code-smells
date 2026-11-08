namespace CodeSmells.Comments.PoorlyWrittenComment.Smelly;

public class LoyaltyDiscountPolicy
{
    // this does the discount thing but not allways, careful sometimes it dont apply (ask Pete??)
    // the 10 is the old one i think, now its diferent 4 the vips, check the other func that does smth similar
    // DONT TOUCH!!! it works
    // SMELL: ambiguous comment, full of typos and with no useful information: it does not say which business
    //        rule applies, it points to people and to "the other func", and "DONT TOUCH" only conveys fear.
    public decimal Apply(decimal amount, int years, bool vip)
    {
        // if its bigger than the other thing
        // SMELL: "the other thing" means nothing to the reader.
        if (amount >= 100m)
        {
            // yeah, that
            // SMELL: a comment with no content at all.
            if (vip || years >= 5)
            {
                return amount * 0.85m; // 15 i think
            }
            return amount * 0.90m;
        }
        return amount;
    }
}
