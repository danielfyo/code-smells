using System;
using Xunit;
using Xunit.Categories;

namespace CodeSmells.Comments
{
    /// <summary>
    /// All relevant comments should be updated, this way you will provide truthful information and developers won't get confused.
    /// </summary>
    public class ObsoleteCommentsTest
    {
        /// <summary>
        /// in this case there is no guarantee that the current format will be updated in the comment which promotes obsolete as well as obvious comments
        /// </summary>
        [Fact]
        [UnitTest]
        public void Obsolete_comments_code_smell()
        {
            //Last login date as String (MM/dd/YYY/ HH:mm:ss)
            String LastLoginDate = DateTimeOffset.Now.ToString();
        }

        /// <summary>
        /// Solution: Declare the variable as DateTimeOffset and remove comment and redundant type of data as part of the name
        /// </summary>
        [Fact]
        [UnitTest]
        public void Obsolete_comments_solution()
        {
            DateTimeOffset LastLogin = DateTimeOffset.Now;
        }
    }
}
