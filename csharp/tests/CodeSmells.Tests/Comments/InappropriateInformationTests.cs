using S = CodeSmells.Comments.InappropriateInformation.Smelly;
using R = CodeSmells.Comments.InappropriateInformation.Refactored;

namespace CodeSmells.Tests.Comments;

public class InappropriateInformationTests
{
    [Fact]
    public void Both_versions_generate_the_same_sequence()
    {
        var smelly = new S.InvoiceNumberGenerator();
        var refactored = new R.InvoiceNumberGenerator();

        for (var i = 0; i < 3; i++)
        {
            Assert.Equal(smelly.Next("A", 2024), refactored.Next("A", 2024));
        }
    }

    [Fact]
    public void Numbers_are_zero_padded_to_six_digits()
    {
        var generator = new R.InvoiceNumberGenerator();

        Assert.Equal("A-2024-000001", generator.Next("A", 2024));
        Assert.Equal("B-2025-000002", generator.Next("B", 2025));
    }
}
