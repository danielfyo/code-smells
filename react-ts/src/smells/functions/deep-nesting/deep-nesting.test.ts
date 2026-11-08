import { editPermission as smelly, type Member, type Doc } from "./Smelly";
import { editPermission as refactored } from "./Refactored";

const doc: Doc = { ownerId: "u1", locked: false, archived: false, sharedWith: ["u2", "u3"] };

const cases: [Member | undefined, Doc, string][] = [
  [undefined, doc, "denied: anonymous"],
  [{ id: "u2", role: "editor", suspended: true }, doc, "denied: user suspended"],
  [{ id: "u1", role: "viewer", suspended: false }, { ...doc, archived: true }, "denied: archived"],
  [{ id: "u1", role: "viewer", suspended: false }, doc, "allowed"],
  [{ id: "u9", role: "editor", suspended: false }, doc, "denied: not shared"],
  [{ id: "u3", role: "viewer", suspended: false }, doc, "denied: read only"],
  [{ id: "u2", role: "editor", suspended: false }, { ...doc, locked: true }, "denied: document locked"],
  [{ id: "u2", role: "editor", suspended: false }, doc, "allowed"],
];

describe("Deep Nesting", () => {
  it.each(cases)("case %# → same result", (member, d, expected) => {
    expect(smelly(member, d)).toBe(expected);
    expect(refactored(member, d)).toBe(expected);
  });
});
