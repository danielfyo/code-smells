namespace CodeSmells.CsharpSpecific.SyncOverAsync.Smelly;

public sealed record Profile(int Id, string Name);

public interface IProfileApi
{
    Task<Profile> GetProfileAsync(int id);
}

public class ProfileService(IProfileApi api)
{
    // SMELL: sync over async. .Result (or .Wait(), or GetAwaiter().GetResult()) blocks the current thread
    //        until the Task completes:
    //  - With a single-threaded SynchronizationContext (WinForms, WPF, classic ASP.NET), the continuation
    //    needs that very thread, which is blocked waiting for it: DEADLOCK.
    //  - In ASP.NET Core it blocks pool threads -> thread-pool starvation under load.
    //  - Exceptions arrive wrapped in AggregateException.
    public Profile GetProfile(int id) => api.GetProfileAsync(id).Result;
}
