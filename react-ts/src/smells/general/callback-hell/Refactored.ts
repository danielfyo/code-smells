// REFACTOR: the async flow is flattened with Promises and async/await. It reads top to
// bottom like synchronous code and errors propagate on their own (a single try/catch above).
export interface User {
  id: number;
  name: string;
}
export interface Order {
  id: number;
  total: number;
}

export interface AsyncApi {
  findUser(email: string): Promise<User>;
  listOrders(userId: number): Promise<Order[]>;
  sendEmail(to: string, body: string): Promise<void>;
}

export async function sendOrderSummary(api: AsyncApi, email: string): Promise<string> {
  const user = await api.findUser(email);
  const orders = await api.listOrders(user.id);
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  const body = `Hi ${user.name}, you have ${orders.length} orders totaling ${total} €`;
  await api.sendEmail(email, body);
  return body;
}
