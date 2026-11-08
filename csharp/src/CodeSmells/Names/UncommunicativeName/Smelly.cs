namespace CodeSmells.Names.UncommunicativeName.Smelly;

public static class Proc
{
    // SMELL: "Proc", "Calc", "d", "r", "tmp", "x", "lst2"... none of them reveals the intent.
    //        To know what the method does you have to read (and decipher) its whole body.
    public static decimal Calc(List<decimal[]> d, decimal r)
    {
        decimal tmp = 0;
        var lst2 = new List<decimal[]>();
        foreach (var x in d)
        {
            // SMELL: x[0], x[1], x[2]... price? quantity? discount? Unnamed magic indexes.
            if (x[1] > 0)
            {
                lst2.Add(x);
            }
        }

        foreach (var x in lst2)
        {
            tmp += x[0] * x[1] * (1 - x[2]);
        }

        return Math.Round(tmp * (1 + r), 2);
    }
}
