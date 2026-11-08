import { publishArticle as smelly } from "./Smelly";
import { publishArticle as refactored, slugify, readingTime } from "./Refactored";

const draft = {
  title: "Why Does Café Coffee Taste Better in Spain?",
  body: "First paragraph.\n\nSecond paragraph with more words.",
  tags: ["coffee", "travel"],
};

describe("Mixed Levels of Abstraction", () => {
  it("both publish the same article and store it", () => {
    const store1 = new Map();
    const store2 = new Map();
    expect(refactored(draft, store2)).toEqual(smelly(draft, store1));
    expect([...store2.keys()]).toEqual([...store1.keys()]);
    expect([...store2.keys()]).toEqual(["why-does-cafe-coffee-taste-better-in-spain"]);
  });

  it("both reject incomplete drafts", () => {
    const empty = { ...draft, body: "  " };
    expect(() => smelly(empty, new Map())).toThrow("Incomplete draft");
    expect(() => refactored(empty, new Map())).toThrow("Incomplete draft");
  });

  it("the low-level details are tested separately", () => {
    expect(slugify("  Hello,   World!! ")).toBe("hello-world");
    expect(readingTime("word ".repeat(450))).toBe(2);
  });
});
