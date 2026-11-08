namespace CodeSmells.Functions.ComplicatedBooleanExpression.Smelly;

public sealed record LoanApplication(int Age, decimal MonthlyIncome, decimal MonthlyDebt, int CreditScore,
    bool HasGuarantor, int YearsEmployed, bool IsSelfEmployed);

public static class LoanApprover
{
    // SMELL: Complicated Boolean Expression. A single multi-line condition with nested
    // parentheses and negations, mixing age, debt-to-income ratio, credit score and job
    // stability. To know why an application is rejected you have to decipher all of it.
    public static bool Approve(LoanApplication a) =>
        a.Age >= 18 && a.Age <= 70
        && !(a.MonthlyIncome == 0 || a.MonthlyDebt / a.MonthlyIncome > 0.40m)
        && (a.CreditScore >= 700 || (a.CreditScore >= 600 && a.HasGuarantor))
        && ((!a.IsSelfEmployed && a.YearsEmployed >= 1) || (a.IsSelfEmployed && a.YearsEmployed >= 2) || a.HasGuarantor);
}
