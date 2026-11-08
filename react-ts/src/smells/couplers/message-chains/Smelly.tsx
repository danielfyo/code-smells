// SMELL: Message Chains (Train Wreck). To render a delivery label the component
// navigates order → customer → address → city → region. It is coupled to the
// whole structure: if the address changes shape, it breaks.
export class Region {
  constructor(readonly code: string) {}
}
export class City {
  constructor(
    readonly name: string,
    private region: Region,
  ) {}
  getRegion(): Region {
    return this.region;
  }
}
export class Address {
  constructor(
    readonly street: string,
    private city: City,
  ) {}
  getCity(): City {
    return this.city;
  }
}
export class Customer {
  constructor(
    readonly name: string,
    private address: Address,
  ) {}
  getAddress(): Address {
    return this.address;
  }
}
export class Order {
  constructor(
    readonly id: string,
    private customer: Customer,
  ) {}
  getCustomer(): Customer {
    return this.customer;
  }
}

export function CourierLabel({ order }: { order: Order }) {
  // SMELL: a four-hop chain repeated twice inside the render.
  const city = order.getCustomer().getAddress().getCity().name;
  const zone = order.getCustomer().getAddress().getCity().getRegion().code === "IC" ? "Islands" : "Mainland";
  return (
    <p>
      {order.id} → {city} ({zone})
    </p>
  );
}
