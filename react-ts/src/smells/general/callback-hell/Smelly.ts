// SMELL: callback hell. Each async step nests the next one; error handling is repeated
// at every level and the "happy" path gets lost in the pyramid.
export interface User {
  id: number;
  name: string;
}
export interface Order {
  id: number;
  total: number;
}
type Callback<T> = (error: Error | null, result?: T) => void;

export interface CallbackApi {
  findUser(email: string, cb: Callback<User>): void;
  listOrders(userId: number, cb: Callback<Order[]>): void;
  sendEmail(to: string, body: string, cb: Callback<void>): void;
}

export function sendOrderSummary(api: CallbackApi, email: string, done: Callback<string>): void {
  api.findUser(email, (userError, user) => {
    if (userError || !user) {
      done(userError ?? new Error("User not found"));
    } else {
      api.listOrders(user.id, (ordersError, orders) => {
        if (ordersError || !orders) {
          done(ordersError ?? new Error("No orders"));
        } else {
          const total = orders.reduce((sum, o) => sum + o.total, 0);
          const body = `Hi ${user.name}, you have ${orders.length} orders totaling ${total} €`;
          api.sendEmail(email, body, (sendError) => {
            if (sendError) {
              done(sendError);
            } else {
              done(null, body);
            }
          });
        }
      });
    }
  });
}
