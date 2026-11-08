import { validateAndSave } from "./Smelly";
import { registerUser, validateSignup } from "./Refactored";

const valid = { email: "anna@shop.com", password: "supersecret" };
const invalid = { email: "anna", password: "123" };

describe("binary-operator-in-name", () => {
  it("both versions save only valid forms", () => {
    const smellyStore = { save: vi.fn() };
    const refactoredStore = { save: vi.fn() };
    expect(validateAndSave(invalid, smellyStore)).toEqual(registerUser(invalid, refactoredStore));
    expect(validateAndSave(valid, smellyStore)).toEqual([]);
    expect(registerUser(valid, refactoredStore)).toEqual([]);
    expect(smellyStore.save).toHaveBeenCalledTimes(1);
    expect(refactoredStore.save).toHaveBeenCalledTimes(1);
  });

  it("refactored can validate without side effects", () => {
    expect(validateSignup(invalid)).toHaveLength(2);
  });
});
