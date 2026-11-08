import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Player } from './model';

// REFACTOR: Separate Query from Modifier / Change Value to Immutable. Inputs are read-only and
// every transformation returns new arrays and new objects.
export function withBonus(players: readonly Player[], name: string): Player[] {
  return players.map((p) => (p.name === name ? { name: `${p.name}*`, points: p.points + 10 } : p));
}

export function rank(players: readonly Player[]): Player[] {
  return [...players].sort((a, b) => b.points - a.points);
}

@Component({
  selector: 'cs-mutable-data-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol>
      @for (player of ranking(); track player.name) {
        <li>{{ player.name }} ({{ player.points }})</li>
      }
    </ol>
  `,
})
export class LeaderboardRefactored {
  readonly players = input<readonly Player[]>([]);
  readonly bonusFor = input('');
  protected readonly ranking = computed(() => rank(withBonus(this.players(), this.bonusFor())));
}
