namespace CodeSmells.General.ObscuredIntent.Smelly;

public static class Billing
{
    // SMELL: "clever" bit arithmetic for leap years. It works, but nobody knows why
    //        (it goes like this: (y & 3) == 0 means "divisible by 4", y & 15 means "divisible by 16"
    //        which, combined with % 25, gives "divisible by 400"). You need to do maths to read it.
    public static bool Leap(int y) => (y & 3) == 0 && (y % 25 != 0 || (y & 15) == 0);

    // SMELL: a single cryptic expression with nested ternaries, one-letter names and magic numbers.
    public static decimal Fee(decimal a, bool p, int d) =>
        a * (p ? .9m : 1m) + (d > 30 ? (d - 30) * (a > 1e3m ? .002m : .005m) * a : 0) + (p ? 0 : 2.5m);
}
