using Xunit;
using Xunit.Categories;

namespace CodeSmells
{
    /// <summary>
    /// Any comment with information that is better registered in another system must be eliminated and your information transferred to said system.
    /// </summary>
    public class InappropriateInformationTest
    {
        /// <summary>
        /// The author and the date of creation are information that belongs to the version control system
        /// </summary>
        [Fact]
        [UnitTest]
        public void Inappropriate_information_code_smell()
        {
            //Author Daniel Yepes
            //Create Date 01-01-2001 01:01:01
            string AnyVar = "new variable";
        }

        /// <summary>
        /// Solution: remove comments and access information from the version control system
        /// </summary>
        [Fact]
        [UnitTest]
        public void Inappropriate_information_solution()
        {
            string AnyVar = "new variable";
        }
    }
}
