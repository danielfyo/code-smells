namespace CodeSmells.Names.NonStandardNomenclature.Smelly;

public class ReportFile
{
    private readonly StringWriter _writer = new();
    public string Name { get; }

    private ReportFile(string name) => Name = name;

    // SMELL: "Manufacture" instead of the standard factory name ("Create").
    public static ReportFile Manufacture(string name) => new(name);

    public void Write(string line) => _writer.WriteLine(line);

    // SMELL: asynchronous method without the "Async" suffix every .NET developer expects.
    public Task<string> Contents() => Task.FromResult(_writer.ToString());

    // SMELL: "IsSame" reinvents equality instead of using Equals/IEquatable<T>.
    //        Dictionaries, HashSet or LINQ Distinct know nothing about it.
    public bool IsSame(ReportFile other) => other.Name == Name;

    // SMELL: "Kill" releases resources but does not implement IDisposable: it does not work with "using"
    //        nor with the analyzers that detect leaks.
    public void Kill() => _writer.Dispose();
}
