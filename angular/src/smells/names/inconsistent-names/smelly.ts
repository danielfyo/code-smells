import { Injectable } from '@angular/core';

export interface Client {
  id: number;
  email: string;
  name: string;
}

// SMELL: inconsistent names. The same concept is a "customer", a "client" and a "user"; the same
// operation is "fetch", "get", "retrieve" and "load". Readers wonder whether these are different
// things (is a client not a customer?) and cannot guess the name of the next method.
@Injectable({ providedIn: 'root' })
export class SmellyCustomerRepository {
  private readonly clients: Client[] = [
    { id: 1, email: 'ana@shop.test', name: 'Ana' },
    { id: 2, email: 'leo@shop.test', name: 'Leo' },
  ];

  fetchAllCustomers(): Client[] {
    return [...this.clients];
  }

  getClient(id: number): Client | undefined {
    return this.clients.find((client) => client.id === id);
  }

  retrieveUserByMail(mail: string): Client | undefined {
    return this.clients.find((c) => c.email === mail);
  }

  loadBuyerCount(): number {
    return this.clients.length;
  }
}
