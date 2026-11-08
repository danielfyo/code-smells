using System.Collections;
using System.Text;
using System.Threading;

namespace CodeSmells.Dispensables.Clutter.Smelly;

// SMELL: Clutter. Unnecessary usings, an explicit empty constructor, unused fields, redundant
// comparisons with true, useless temporary variables, 'this.' everywhere and an 'else' after
// 'return'. Nothing is wrong, but it is all distracting noise.
public class CouponValidator
{
    private int _unusedCounter;
    private readonly string _name = "validator";

    public CouponValidator()
    {
    }

    public bool IsValid(string code, DateOnly expiresOn, DateOnly today)
    {
        bool result = false;
        bool isExpired = today > expiresOn;
        if (isExpired == true)
        {
            result = false;
            return result;
        }
        else
        {
            if (this.HasValidFormat(code) == true)
            {
                result = true;
            }
            else
            {
                result = false;
            }
        }
        return result;
    }

    private bool HasValidFormat(string code)
    {
        var trimmed = code;
        if (trimmed.Length == 8 && trimmed.All(char.IsLetterOrDigit))
            return true;
        else
            return false;
    }
}
