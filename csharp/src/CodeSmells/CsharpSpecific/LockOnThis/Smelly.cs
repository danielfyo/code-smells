namespace CodeSmells.CsharpSpecific.LockOnThis.Smelly;

public class StockCounter
{
    private int _units;

    // SMELL: lock (this) uses a PUBLIC object as the monitor. Any code holding a reference to the
    //        instance can lock on it too (lock (counter) { ... }) and block, or deadlock, this class
    //        without it knowing. The same applies to lock (typeof(X)) or lock on strings.
    public void Add(int units)
    {
        lock (this)
        {
            _units += units;
        }
    }

    public int Units
    {
        get { lock (this) return _units; }
    }
}
