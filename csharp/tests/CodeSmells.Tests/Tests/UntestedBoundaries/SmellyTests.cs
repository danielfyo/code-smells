using CodeSmells.Tests.UntestedBoundaries;

namespace CodeSmells.Tests.Tests.UntestedBoundaries;

// SMELL: only "comfortable" values in the middle of each range are tested. If someone changes "<= 17" to "< 17"
//        (the classic off-by-one), all these tests stay green.
public class SmellyTests
{
    [Fact]
    public void Classifies_ages()
    {
        Assert.Equal(TicketType.Child, AgeCategory.Classify(5));
        Assert.Equal(TicketType.Teen, AgeCategory.Classify(15));
        Assert.Equal(TicketType.Adult, AgeCategory.Classify(30));
        Assert.Equal(TicketType.Senior, AgeCategory.Classify(80));
    }
}
