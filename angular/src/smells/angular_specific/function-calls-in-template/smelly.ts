import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface BasketLine {
  product: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'cs-function-calls-in-template-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="theme" (click)="toggleTheme()">{{ dark() ? 'Light' : 'Dark' }} mode</button>
    <p class="total">Total: {{ computeTotal() }} EUR</p>
    <p class="count">{{ countExpensive() }} premium items</p>
  `,
})
export class SmellyBasketComponent {
  readonly lines = signal<BasketLine[]>([]);
  readonly dark = signal(false);
  computations = 0;

  toggleTheme(): void {
    this.dark.update((dark) => !dark);
  }

  // SMELL: function calls in templates. Angular cannot know whether a plain method's result changed,
  // so it calls it again on every change detection pass of this view: toggling the theme, any
  // event, any signal read here. With expensive work or long lists this burns CPU on every click.
  computeTotal(): number {
    this.computations++;
    return this.lines().reduce((sum, line) => sum + line.price * line.quantity, 0);
  }

  countExpensive(): number {
    this.computations++;
    return this.lines().filter((line) => line.price >= 100).length;
  }
}
