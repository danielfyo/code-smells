import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Book {
  title: string;
  author: string;
  price: number;
}

// SMELL: short names for long scopes. `b`, `q`, `r` and `t` live for the whole life of the
// component and are read from the template and several methods. A one-letter name is fine for a
// two-line lambda, not for state that the reader meets far away from its declaration.
@Component({
  selector: 'cs-short-names-long-scopes-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input class="search" [value]="q()" (input)="s($event)" />
    <p class="summary">{{ r().length }} books, {{ t() }} EUR</p>
    <ul>
      @for (x of r(); track x.title) {
        <li>{{ x.title }}</li>
      }
    </ul>
  `,
})
export class SmellyBookSearchComponent {
  readonly b = input.required<Book[]>();
  readonly q = signal('');
  readonly r = computed(() => {
    const l = this.q().toLowerCase();
    return this.b().filter((x) => x.title.toLowerCase().includes(l) || x.author.toLowerCase().includes(l));
  });
  readonly t = computed(() => this.r().reduce((a, x) => a + x.price, 0));

  s(e: Event): void {
    this.q.set((e.target as HTMLInputElement).value);
  }
}
