using R = CodeSmells.Data.MutableData.Refactored;
using S = CodeSmells.Data.MutableData.Smelly;

namespace CodeSmells.Tests.Data;

public class MutableDataTests
{
    [Fact]
    public void Both_return_the_same_planned_order()
    {
        var s = new S.DeliveryRoute();
        s.Stops.AddRange([new S.Stop { City = "Zaragoza", DistanceFromDepotKm = 34 }, new S.Stop { City = "Huesca", DistanceFromDepotKm = 7 }]);
        var r = R.DeliveryRoute.Of(new("Zaragoza", 34), new("Huesca", 7));

        var sPlan = S.RoutePlanner.NearestFirst(s).Select(x => (x.City, x.DistanceFromDepotKm));
        var rPlan = R.RoutePlanner.NearestFirst(r).Select(x => (x.City, x.DistanceFromDepotKm));
        Assert.Equal(sPlan, rPlan);
    }

    [Fact]
    public void Smelly_planner_corrupts_the_original_route()
    {
        var s = new S.DeliveryRoute();
        s.Stops.Add(new S.Stop { City = "Teruel", DistanceFromDepotKm = 41 });
        var before = s.TotalKm();
        S.RoutePlanner.NearestFirst(s);
        Assert.Equal(82, before);
        Assert.Equal(100, s.TotalKm()); // the original route has changed

        var r = R.DeliveryRoute.Of(new R.Stop("Teruel", 41));
        R.RoutePlanner.NearestFirst(r);
        Assert.Equal(82, r.TotalKm());
    }
}
