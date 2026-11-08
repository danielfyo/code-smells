namespace CodeSmells.General.ConventionOverStructure.Smelly;

// IMPORTANT: if you add a payment method, remember to add a case to Fee() AND to Label()!
// SMELL: correctness depends on a convention written in a comment.
//        It relies on people reading and remembering this comment.
public enum PaymentMethod { Card, Transfer, PayPal }

public static class PaymentRules
{
    public static decimal Fee(PaymentMethod method, decimal amount) => method switch
    {
        PaymentMethod.Card => amount * 0.015m,
        PaymentMethod.Transfer => 0.35m,
        PaymentMethod.PayPal => amount * 0.029m + 0.30m,
        // SMELL: if a value is added to the enum and forgotten here, it is only discovered in production.
        _ => throw new NotSupportedException(method.ToString()),
    };

    public static string Label(PaymentMethod method) => method switch
    {
        PaymentMethod.Card => "Credit card",
        PaymentMethod.Transfer => "Bank transfer",
        PaymentMethod.PayPal => "PayPal",
        _ => throw new NotSupportedException(method.ToString()),
    };
}
