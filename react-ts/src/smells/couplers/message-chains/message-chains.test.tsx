import { render } from "@testing-library/react";
import * as S from "./Smelly";
import * as R from "./Refactored";

function smellyOrder(city: string, region: string) {
  return new S.Order("P-1", new S.Customer("Alba", new S.Address("1 Main St", new S.City(city, new S.Region(region)))));
}
function refactoredOrder(city: string, region: string) {
  return new R.Order("P-1", new R.Customer("Alba", new R.Address("1 Main St", new R.City(city, new R.Region(region)))));
}

describe("Message Chains", () => {
  it.each([
    ["Tenerife", "IC"],
    ["Zaragoza", "AR"],
  ])("identical label for %s", (city, region) => {
    const { container: a } = render(<S.CourierLabel order={smellyOrder(city, region)} />);
    const { container: b } = render(<R.CourierLabel order={refactoredOrder(city, region)} />);
    expect(b.textContent).toBe(a.textContent);
  });

  it("the order answers directly without exposing the chain", () => {
    const order = refactoredOrder("Tenerife", "IC");
    expect(order.deliveryZone()).toBe("Islands");
    expect(order.deliveryCity()).toBe("Tenerife");
  });
});
