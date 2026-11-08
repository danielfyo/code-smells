namespace CodeSmells.CsharpSpecific.LockOnThis.Refactored;

public class StockCounter
{
    // REFACTOR: a private, read-only object used only as a lock. Nobody outside the class can reach it,
    //           so nobody else can take it. (In .NET 9+ the dedicated System.Threading.Lock type is preferred.)
    private readonly object _gate = new();
    private int _units;

    public void Add(int units)
    {
        lock (_gate)
        {
            _units += units;
        }
    }

    public int Units
    {
        get { lock (_gate)
            {
                return _units;
            }
        }
    }
}
