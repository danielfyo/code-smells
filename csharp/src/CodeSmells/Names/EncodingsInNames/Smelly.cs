namespace CodeSmells.Names.EncodingsInNames.Smelly;

// SMELL: "Class"/"Interface" suffixes that tell the consumer nothing; C/cls prefixes from another era.
public interface ICustomerInterface
{
    string GetStrFullName();
}

public class CCustomerClass : ICustomerInterface
{
    // SMELL: Hungarian notation and m_ prefixes: the compiler (and the IDE) already know the type.
    //        If strFirstName becomes a Name type, the "str" prefix will lie.
    private string m_strFirstName;
    private string m_strLastName;
    private bool m_bIsActive;
    private List<decimal> m_lstOrderAmounts = new();
    private int m_iOrderCount;

    public CCustomerClass(string strFirstName, string strLastName, bool bIsActive)
    {
        m_strFirstName = strFirstName;
        m_strLastName = strLastName;
        m_bIsActive = bIsActive;
    }

    public bool GetBIsActive() => m_bIsActive;

    public void AddOrderDecAmount(decimal decAmount)
    {
        m_lstOrderAmounts.Add(decAmount);
        m_iOrderCount++;
    }

    public decimal GetDecTotalSpent() => m_lstOrderAmounts.Sum();
    public int GetIOrderCount() => m_iOrderCount;
    public string GetStrFullName() => $"{m_strFirstName} {m_strLastName}";
}
