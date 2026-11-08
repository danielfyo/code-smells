export interface Song {
  title: string;
  seconds: number;
}

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

// SMELL: Middle Man. `PlaylistManager` adds nothing: all of its methods just
// forward the call to `Playlist`. Every new Playlist method forces us to write
// yet another forwarder here.
export class PlaylistManager {
  private playlist = new Playlist();

  addSong(song: Song): void {
    this.playlist.add(song);
  }
  removeSong(title: string): void {
    this.playlist.remove(title);
  }
  getTitles(): string[] {
    return this.playlist.titles();
  }
  getTotalSeconds(): number {
    return this.playlist.totalSeconds();
  }
}

// The client works through the middle man.
export function buildRoadTripMix(): { titles: string[]; minutes: number } {
  const manager = new PlaylistManager();
  manager.addSong({ title: "Highway Star", seconds: 368 });
  manager.addSong({ title: "Roadrunner", seconds: 245 });
  manager.addSong({ title: "Slow Ballad", seconds: 187 });
  manager.removeSong("Slow Ballad");
  return { titles: manager.getTitles(), minutes: Math.round(manager.getTotalSeconds() / 60) };
}
