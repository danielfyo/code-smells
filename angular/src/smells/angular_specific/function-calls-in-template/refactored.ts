import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface BasketLine {
  product: string;
  price: number;
  quantity: number;
}

// REFACTOR: Replace template methods with computed signals (or pure pipes). A computed is
// memoized: it recalculates only when the signals it reads change, not on every render.
@Component({
  selector: 'cs-function-calls-in-template-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="theme" (click)="toggleTheme()">{{ dark() ? 'Light' : 'Dark' }} mode</button>
    <p class="total">Total: {{ total() }} EUR</p>
    <p class="count">{{ expensiveCount() }} premium items</p>
  `,
})
export class BasketComponent {
  readonly lines = signal<BasketLine[]>([]);
  readonly dark = signal(false);
  computations = 0;

  readonly total = computed(() => {
    this.computations++;
    return this.lines().reduce((sum, line) => sum + line.price * line.quantity, 0);
  });

  readonly expensiveCount = computed(() => {
    this.computations++;
    return this.lines().filter((line) => line.price >= 100).length;
  });

  toggleTheme(): void {
    this.dark.update((dark) => !dark);
  }
}
