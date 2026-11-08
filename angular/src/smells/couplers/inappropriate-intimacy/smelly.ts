import { Component, Injectable, inject } from '@angular/core';

export interface Track {
  title: string;
  seconds: number;
}

// SMELL: Inappropriate Intimacy. The service exposes its internals (the raw array and a cached
// total) and the component manipulates them directly. Both classes must agree on every detail,
// and any client that forgets to update the cache leaves the service inconsistent.
@Injectable({ providedIn: 'root' })
export class PlaylistSmelly {
  tracks: Track[] = [];
  _totalSeconds = 0;
}

@Component({
  selector: 'cs-inappropriate-intimacy-smelly',
  template: `
    <p>{{ playlist.tracks.length }} tracks, {{ duration() }}</p>
    <button type="button" (click)="addTrack('Intro', 95)">Add intro</button>
  `,
})
export class PlaylistPanelSmelly {
  readonly playlist = inject(PlaylistSmelly);

  addTrack(title: string, seconds: number): void {
    // SMELL: reaching into the service's state and keeping its cache in sync by hand.
    this.playlist.tracks.push({ title, seconds });
    this.playlist._totalSeconds += seconds;
  }

  duration(): string {
    const total = this.playlist._totalSeconds;
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }
}
