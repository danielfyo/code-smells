import { Component, Input } from '@angular/core';
import type { Player } from './model';

// SMELL: Mutable Data. `sort()` reorders the array the parent passed in, and `awardBonus()`
// edits the player objects in place. Other components holding the same array suddenly see a
// different order and different points, and nobody can tell where the change came from.
@Component({
  selector: 'cs-mutable-data-smelly',
  template: `
    <ol>
      @for (player of ranking(); track player.name) {
        <li>{{ player.name }} ({{ player.points }})</li>
      }
    </ol>
  `,
})
export class LeaderboardSmelly {
  @Input() players: Player[] = [];
  @Input() bonusFor = '';

  ranking(): Player[] {
    this.awardBonus();
    return this.players.sort((a, b) => b.points - a.points);
  }

  private awardBonus(): void {
    const player = this.players.find((p) => p.name === this.bonusFor);
    if (player && !player.name.endsWith('*')) {
      player.points += 10;
      player.name += '*';
    }
  }
}
