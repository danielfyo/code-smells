import { importContacts as smelly } from "./Smelly";
import { importContacts as refactored, parseContact } from "./Refactored";

const csv = ["Ana; ANA@MAIL.COM; 34", "; no-at-sign; -1", "Leo; leo@mail.com; 28"].join("\n");

describe("Output Arguments", () => {
  it("both imports produce the same contacts and errors", () => {
    expect(refactored(csv)).toEqual(smelly(csv));
    expect(refactored(csv).contacts.map((c) => c.email)).toEqual(["ana@mail.com", "leo@mail.com"]);
    expect(refactored(csv).errors).toEqual(["empty name", "invalid email: no-at-sign", "invalid age: -1"]);
  });

  it("parseContact returns its result instead of writing into arguments", () => {
    expect(parseContact("Eva; eva@x.es; 40")).toEqual({ ok: true, contact: { name: "Eva", email: "eva@x.es", age: 40 } });
  });
});
