namespace CodeSmells.Names.NonStandardNomenclature.Refactored;

// REFACTOR: the standard .NET names and contracts are adopted: Create, the Async suffix,
//           IEquatable<T>/Equals/GetHashCode and IDisposable. Every reader (and the framework) recognizes them.
public sealed class ReportFile : IEquatable<ReportFile>, IDisposable
{
    private readonly StringWriter _writer = new();
    public string Name { get; }

    private ReportFile(string name) => Name = name;

    public static ReportFile Create(string name) => new(name);

    public void Write(string line) => _writer.WriteLine(line);

    public Task<string> GetContentsAsync() => Task.FromResult(_writer.ToString());

    public bool Equals(ReportFile? other) => other is not null && other.Name == Name;
    public override bool Equals(object? obj) => Equals(obj as ReportFile);
    public override int GetHashCode() => Name.GetHashCode();

    public void Dispose() => _writer.Dispose();
}
