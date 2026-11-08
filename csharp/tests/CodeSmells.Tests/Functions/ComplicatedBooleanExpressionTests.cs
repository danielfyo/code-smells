using R = CodeSmells.Functions.ComplicatedBooleanExpression.Refactored;
using S = CodeSmells.Functions.ComplicatedBooleanExpression.Smelly;

namespace CodeSmells.Tests.Functions;

public class ComplicatedBooleanExpressionTests
{
    [Fact]
    public void Named_predicates_match_the_big_expression_exhaustively()
    {
        foreach (var age in new[] { 17, 30, 71 })
        {
            foreach (var (income, debt) in new[] { (0m, 0m), (3000m, 900m), (3000m, 1500m) })
            {
                foreach (var score in new[] { 550, 650, 750 })
                {
                    foreach (var guarantor in new[] { false, true })
                    {
                        foreach (var years in new[] { 0, 1, 3 })
                        {
                            foreach (var self in new[] { false, true })
        {
            var s = new S.LoanApplication(age, income, debt, score, guarantor, years, self);
            var r = new R.LoanApplication(age, income, debt, score, guarantor, years, self);
            Assert.Equal(S.LoanApprover.Approve(s), R.LoanApprover.Approve(r));
        }
                        }
                    }
                }
            }
        }
    }
}
