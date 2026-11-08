namespace CodeSmells.OoAbusers.InappropriateStatic.Refactored;

public sealed record Booking(string Reference, DateTime StartsAt, decimal Price);

// REFACTOR: Replace Static with Instance + Inject Dependency. The clock and the policy are
// injected abstractions: they can be replaced (polymorphism) and pinned down in tests.
public interface IClock { DateTime Now { get; } }

public sealed class SystemClock : IClock { public DateTime Now => DateTime.Now; }

public sealed class FixedClock(DateTime now) : IClock { public DateTime Now { get; } = now; }

public interface ICancellationPolicy { decimal Fee(Booking booking, DateTime now); }

public sealed class StandardCancellationPolicy : ICancellationPolicy
{
    public decimal Fee(Booking booking, DateTime now) => (booking.StartsAt - now).TotalHours switch
    {
        >= 48 => 0m,
        >= 24 => booking.Price * 0.5m,
        _ => booking.Price,
    };
}

public sealed class FlexibleCancellationPolicy : ICancellationPolicy
{
    public decimal Fee(Booking booking, DateTime now) => (booking.StartsAt - now).TotalHours >= 2 ? 0m : booking.Price * 0.2m;
}

public sealed class BookingService(ICancellationPolicy policy, IClock clock)
{
    public decimal Cancel(Booking booking) => policy.Fee(booking, clock.Now);
}
