import { LocalStoragePreferences as SmellyRepo } from "./Smelly";
import { LocalStoragePreferences as RefactoredRepo } from "./Refactored";

describe("wrong-abstraction-level-name", () => {
  beforeEach(() => localStorage.clear());

  it("smelly saves and reads preferences", () => {
    const repo = new SmellyRepo();
    expect(repo.readJsonFromLocalStorage()).toBeNull();
    repo.writeJsonToLocalStorage({ theme: "dark", language: "es" });
    expect(repo.readJsonFromLocalStorage()).toEqual({ theme: "dark", language: "es" });
  });

  it("refactored saves and reads preferences in the same format", () => {
    const repo = new RefactoredRepo();
    expect(repo.load()).toBeNull();
    repo.save({ theme: "light", language: "en" });
    expect(repo.load()).toEqual({ theme: "light", language: "en" });
    expect(new SmellyRepo().readJsonFromLocalStorage()).toEqual({ theme: "light", language: "en" });
  });
});
