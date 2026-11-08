using CodeSmells.Tests.UntestedBoundaries;

namespace CodeSmells.Tests.Tests.UntestedBoundaries;

// REFACTOR: boundary value analysis: every limit and its neighbour on both sides is tested,
//           plus the extremes of the domain (0, negative values, int.MaxValue).
public class RefactoredTests
{
    [Theory]
    [InlineData(0, TicketType.Child)]
    [InlineData(12, TicketType.Child)]
    [InlineData(13, TicketType.Teen)]
    [InlineData(17, TicketType.Teen)]
    [InlineData(18, TicketType.Adult)]
    [InlineData(64, TicketType.Adult)]
    [InlineData(65, TicketType.Senior)]
    [InlineData(int.MaxValue, TicketType.Senior)]
    public void Classifies_each_boundary(int age, TicketType expected) =>
        Assert.Equal(expected, AgeCategory.Classify(age));

    [Theory]
    [InlineData(-1)]
    [InlineData(int.MinValue)]
    public void Rejects_negative_ages(int age) =>
        Assert.Throws<ArgumentOutOfRangeException>(() => AgeCategory.Classify(age));
}
