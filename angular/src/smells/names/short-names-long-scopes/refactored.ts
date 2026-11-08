import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface Book {
  title: string;
  author: string;
  price: number;
}

// REFACTOR: Rename Field. The longer a name lives, the more descriptive it is: books, query,
// matches, totalPrice, search(). Short names survive only inside tiny lambdas (`sum`, `book`).
@Component({
  selector: 'cs-short-names-long-scopes-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input class="search" [value]="query()" (input)="search($event)" />
    <p class="summary">{{ matches().length }} books, {{ totalPrice() }} EUR</p>
    <ul>
      @for (book of matches(); track book.title) {
        <li>{{ book.title }}</li>
      }
    </ul>
  `,
})
export class BookSearchComponent {
  readonly books = input.required<Book[]>();
  readonly query = signal('');

  readonly matches = computed(() => {
    const needle = this.query().toLowerCase();
    return this.books().filter(
      (book) => book.title.toLowerCase().includes(needle) || book.author.toLowerCase().includes(needle),
    );
  });

  readonly totalPrice = computed(() => this.matches().reduce((sum, book) => sum + book.price, 0));

  search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
