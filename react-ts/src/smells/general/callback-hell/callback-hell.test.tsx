import { sendOrderSummary as smellySend, type CallbackApi } from "./Smelly";
import { sendOrderSummary as refactoredSend, type AsyncApi } from "./Refactored";

const user = { id: 7, name: "Anna" };
const orders = [
  { id: 1, total: 20 },
  { id: 2, total: 15 },
];

function callbackApi(failOn?: "orders"): CallbackApi {
  return {
    findUser: (_email, cb) => setTimeout(() => cb(null, user), 0),
    listOrders: (_id, cb) => setTimeout(() => (failOn === "orders" ? cb(new Error("DB down")) : cb(null, orders)), 0),
    sendEmail: (_to, _body, cb) => setTimeout(() => cb(null), 0),
  };
}

function asyncApi(failOn?: "orders"): AsyncApi {
  return {
    findUser: async () => user,
    listOrders: async () => {
      if (failOn === "orders") throw new Error("DB down");
      return orders;
    },
    sendEmail: async () => undefined,
  };
}

const runSmelly = (api: CallbackApi) =>
  new Promise<string>((resolve, reject) =>
    smellySend(api, "anna@shop.com", (error, body) => (error ? reject(error) : resolve(body ?? ""))),
  );

describe("callback-hell", () => {
  it("both versions compose and send the same summary", async () => {
    const expected = "Hi Anna, you have 2 orders totaling 35 €";
    await expect(runSmelly(callbackApi())).resolves.toBe(expected);
    await expect(refactoredSend(asyncApi(), "anna@shop.com")).resolves.toBe(expected);
  });

  it("both versions propagate an error from an intermediate step", async () => {
    await expect(runSmelly(callbackApi("orders"))).rejects.toThrow("DB down");
    await expect(refactoredSend(asyncApi("orders"), "anna@shop.com")).rejects.toThrow("DB down");
  });
});
