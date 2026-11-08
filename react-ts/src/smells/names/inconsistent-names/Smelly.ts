// SMELL: inconsistent names. The same concept (customer) is called user, client and
// customer; the same operation (get) is fetch, get and retrieve. The reader wonders
// whether they are different things.
export interface Client {
  id: number;
  name: string;
}

const db: Client[] = [
  { id: 1, name: "Anna" },
  { id: 2, name: "Luke" },
];

export function fetchUser(id: number): Client | undefined {
  return db.find((c) => c.id === id);
}

export function getAllClients(): Client[] {
  return [...db];
}

export function retrieveCustomerName(clientId: number): string {
  return fetchUser(clientId)?.name ?? "unknown";
}
