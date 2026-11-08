namespace CodeSmells.Dispensables.SpeculativeGenerality.Smelly;

// SMELL: Speculative Generality. To price a single kind of shipment someone built a generic
// hierarchy, a factory, a "BeforeCalculate" hook nobody overrides and an 'options' parameter that
// always arrives empty. All of it "in case some day...".

public interface IPricingStrategy<TContext, TResult>
{
    TResult Calculate(TContext context, IDictionary<string, object>? options = null);
}

public abstract class PricingStrategyBase<TContext, TResult> : IPricingStrategy<TContext, TResult>
{
    public TResult Calculate(TContext context, IDictionary<string, object>? options = null)
    {
        BeforeCalculate(context);
        return DoCalculate(context, options ?? new Dictionary<string, object>());
    }

    protected virtual void BeforeCalculate(TContext context) { } // unused hook
    protected abstract TResult DoCalculate(TContext context, IDictionary<string, object> options);
}

public sealed record Parcel(decimal WeightKg);

public sealed class WeightPricingStrategy : PricingStrategyBase<Parcel, decimal>
{
    protected override decimal DoCalculate(Parcel parcel, IDictionary<string, object> options) =>
        3m + parcel.WeightKg * 0.75m;
}

public static class PricingStrategyFactory
{
    public static IPricingStrategy<Parcel, decimal> Create(string kind = "weight") => kind switch
    {
        "weight" => new WeightPricingStrategy(),
        _ => throw new NotImplementedException(), // nobody ever asked for another one
    };
}
