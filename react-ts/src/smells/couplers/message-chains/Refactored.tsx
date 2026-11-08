// REFACTOR: Hide Delegate. Each object exposes what its clients need and hides
// how it gets it. The component only talks to its immediate neighbour (Law of
// Demeter): `order.deliveryCity()` and `order.deliveryZone()`.
export type Zone = "Islands" | "Mainland";

export class Region {
  constructor(readonly code: string) {}
  get zone(): Zone {
    return this.code === "IC" ? "Islands" : "Mainland";
  }
}
export class City {
  constructor(
    readonly name: string,
    private readonly region: Region,
  ) {}
  get zone(): Zone {
    return this.region.zone;
  }
}
export class Address {
  constructor(
    readonly street: string,
    private readonly city: City,
  ) {}
  get cityName(): string {
    return this.city.name;
  }
  get zone(): Zone {
    return this.city.zone;
  }
}
export class Customer {
  constructor(
    readonly name: string,
    private readonly address: Address,
  ) {}
  get shippingAddress(): Address {
    return this.address;
  }
}
export class Order {
  constructor(
    readonly id: string,
    private readonly customer: Customer,
  ) {}
  deliveryCity(): string {
    return this.customer.shippingAddress.cityName;
  }
  deliveryZone(): Zone {
    return this.customer.shippingAddress.zone;
  }
}

export function CourierLabel({ order }: { order: Order }) {
  return (
    <p>
      {order.id} → {order.deliveryCity()} ({order.deliveryZone()})
    </p>
  );
}
