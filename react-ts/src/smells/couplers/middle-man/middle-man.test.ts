import { buildRoadTripMix as smellyMix, PlaylistManager } from "./Smelly";
import { buildRoadTripMix as refactoredMix } from "./Refactored";

describe("Middle Man", () => {
  it("the result is identical without the middle man", () => {
    expect(refactoredMix()).toEqual(smellyMix());
    expect(refactoredMix()).toEqual({ titles: ["Highway Star", "Roadrunner"], minutes: 10 });
  });

  it("the middle man has no logic of its own: it only forwards", () => {
    const manager = new PlaylistManager();
    const methods = Object.getOwnPropertyNames(PlaylistManager.prototype).filter((m) => m !== "constructor");
    expect(methods).toHaveLength(4);
    manager.addSong({ title: "X", seconds: 60 });
    expect(manager.getTitles()).toEqual(["X"]);
  });
});
