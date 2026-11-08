namespace CodeSmells.General.ConventionOverStructure.Refactored;

// REFACTOR: Replace Conditional with Polymorphism: each payment method is a type that MUST implement
//           Fee and Label (abstract members). Forgetting one is a compile error, not a comment.
public abstract record PaymentMethod
{
    public abstract string Label { get; }
    public abstract decimal Fee(decimal amount);

    public static readonly PaymentMethod Card = new CardPayment();
    public static readonly PaymentMethod Transfer = new BankTransfer();
    public static readonly PaymentMethod PayPal = new PayPalPayment();

    private sealed record CardPayment : PaymentMethod
    {
        public override string Label => "Credit card";
        public override decimal Fee(decimal amount) => amount * 0.015m;
    }

    private sealed record BankTransfer : PaymentMethod
    {
        public override string Label => "Bank transfer";
        public override decimal Fee(decimal amount) => 0.35m;
    }

    private sealed record PayPalPayment : PaymentMethod
    {
        public override string Label => "PayPal";
        public override decimal Fee(decimal amount) => amount * 0.029m + 0.30m;
    }
}
