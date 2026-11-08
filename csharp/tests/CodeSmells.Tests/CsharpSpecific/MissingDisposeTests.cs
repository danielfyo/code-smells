using System.Text;
using S = CodeSmells.CsharpSpecific.MissingDispose.Smelly;
using R = CodeSmells.CsharpSpecific.MissingDispose.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class MissingDisposeTests
{
    private sealed class TrackedStream(byte[] data) : MemoryStream(data)
    {
        public bool Disposed { get; private set; }
        protected override void Dispose(bool disposing) { Disposed = true; base.Dispose(disposing); }
    }

    [Fact]
    public void Smelly_export_loses_data_because_the_writer_is_never_flushed()
    {
        using var output = new MemoryStream();

        new S.OrderCsvExporter().Export(new[] { new S.Order(1, 10m) }, output);

        Assert.Equal(0, output.Length); // the data stayed in the StreamWriter's buffer
    }

    [Fact]
    public void Refactored_export_writes_everything()
    {
        using var output = new MemoryStream();

        new R.OrderCsvExporter().Export(new[] { new R.Order(1, 10m) }, output);

        Assert.Equal($"id,amount{Environment.NewLine}1,10{Environment.NewLine}", Encoding.UTF8.GetString(output.ToArray()));
    }

    [Fact]
    public void Both_count_lines_alike_on_valid_files()
    {
        var bytes = Encoding.UTF8.GetBytes("a\nb\nc\n");

        Assert.Equal(3, new S.OrderCsvExporter().CountLines(() => new MemoryStream(bytes)));
        Assert.Equal(3, new R.OrderCsvExporter().CountLines(() => new MemoryStream(bytes)));
    }

    [Fact]
    public void Only_refactored_releases_the_file_when_an_exception_is_thrown()
    {
        var bytes = Encoding.UTF8.GetBytes("a\n\nc\n");
        var smellyStream = new TrackedStream(bytes);
        var refactoredStream = new TrackedStream(bytes);

        Assert.Throws<InvalidDataException>(() => new S.OrderCsvExporter().CountLines(() => smellyStream));
        Assert.Throws<InvalidDataException>(() => new R.OrderCsvExporter().CountLines(() => refactoredStream));

        Assert.False(smellyStream.Disposed);
        Assert.True(refactoredStream.Disposed);
    }
}
