namespace CodeSmells.CsharpSpecific.StaticMutableState.Smelly;

public class InvoiceNumberGenerator(string series)
{
    // SMELL: mutable static fields. Every instance (every tenant, every request, every test) shares the
    //        same counter and the same list; "++" is not atomic, so concurrent requests can get duplicated
    //        numbers, and List<T> is not thread-safe either. Tests influence each other through it.
    private static int _lastNumber;
    public static List<string> Issued = new();

    public string Next()
    {
        _lastNumber++;
        var number = $"{series}-{_lastNumber:D5}";
        Issued.Add(number);
        return number;
    }
}
