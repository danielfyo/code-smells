export interface Song {
  title: string;
  seconds: number;
}

// REFACTOR: Remove Middle Man. The middle man that only delegated is removed
// and the client uses `Playlist` directly. If its own logic is ever needed
// (permissions, auditing...), it will be introduced then.
export class Playlist {
  private songs: Song[] = [];
  add(song: Song): void {
    this.songs.push(song);
  }
  remove(title: string): void {
    this.songs = this.songs.filter((s) => s.title !== title);
  }
  titles(): string[] {
    return this.songs.map((s) => s.title);
  }
  totalSeconds(): number {
    return this.songs.reduce((sum, s) => sum + s.seconds, 0);
  }
}

export function buildRoadTripMix(): { titles: string[]; minutes: number } {
  const playlist = new Playlist();
  playlist.add({ title: "Highway Star", seconds: 368 });
  playlist.add({ title: "Roadrunner", seconds: 245 });
  playlist.add({ title: "Slow Ballad", seconds: 187 });
  playlist.remove("Slow Ballad");
  return { titles: playlist.titles(), minutes: Math.round(playlist.totalSeconds() / 60) };
}
