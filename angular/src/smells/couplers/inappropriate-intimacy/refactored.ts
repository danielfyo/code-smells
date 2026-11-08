import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';

export interface Track {
  title: string;
  seconds: number;
}

// REFACTOR: Encapsulate Collection / Hide internals. State is private, exposed read-only, and
// the derived total is computed, so no client can break the invariant.
@Injectable({ providedIn: 'root' })
export class Playlist {
  private readonly tracksState = signal<readonly Track[]>([]);
  readonly tracks = this.tracksState.asReadonly();
  readonly totalSeconds = computed(() => this.tracksState().reduce((sum, t) => sum + t.seconds, 0));

  add(track: Track): void {
    this.tracksState.update((tracks) => [...tracks, track]);
  }
}

export function formatDuration(totalSeconds: number): string {
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

@Component({
  selector: 'cs-inappropriate-intimacy-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>{{ playlist.tracks().length }} tracks, {{ duration() }}</p>
    <button type="button" (click)="playlist.add({ title: 'Intro', seconds: 95 })">Add intro</button>
  `,
})
export class PlaylistPanelRefactored {
  protected readonly playlist = inject(Playlist);
  protected readonly duration = computed(() => formatDuration(this.playlist.totalSeconds()));
}
