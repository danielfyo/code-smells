namespace CodeSmells.Functions.ComplicatedBooleanExpression.Refactored;

// REFACTOR: Decompose Conditional / Extract Method. Each sub-condition gets a domain name;
// the final rule reads like a sentence.
public sealed record LoanApplication(int Age, decimal MonthlyIncome, decimal MonthlyDebt, int CreditScore,
    bool HasGuarantor, int YearsEmployed, bool IsSelfEmployed)
{
    private const decimal MaxDebtToIncome = 0.40m;

    public bool IsOfEligibleAge => Age is >= 18 and <= 70;

    public bool HasAffordableDebt => MonthlyIncome > 0 && MonthlyDebt / MonthlyIncome <= MaxDebtToIncome;

    public bool HasGoodCredit => CreditScore >= 700 || (CreditScore >= 600 && HasGuarantor);

    public bool HasStableIncome => HasGuarantor || YearsEmployed >= (IsSelfEmployed ? 2 : 1);
}

public static class LoanApprover
{
    public static bool Approve(LoanApplication a) =>
        a.IsOfEligibleAge && a.HasAffordableDebt && a.HasGoodCredit && a.HasStableIncome;
}
