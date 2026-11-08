namespace CodeSmells.CsharpSpecific.SyncOverAsync.Refactored;

public sealed record Profile(int Id, string Name);

public interface IProfileApi
{
    Task<Profile> GetProfileAsync(int id);
}

public class ProfileService(IProfileApi api)
{
    // REFACTOR: "async all the way": the method is asynchronous and callers await it instead of
    //           blocking. Exceptions arrive unwrapped. In library code, ConfigureAwait(false)
    //           also avoids depending on the caller's context.
    public async Task<Profile> GetProfileAsync(int id) =>
        await api.GetProfileAsync(id).ConfigureAwait(false);
}
