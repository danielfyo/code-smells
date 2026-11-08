export interface Customer {
  id: number;
  name: string;
  city: string;
}

export interface Order {
  id: number;
  customerId: number;
  totalCents: number;
}
