import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';

export interface Book {
  isbn: string;
  title: string;
  available: boolean;
}

interface Loan {
  isbn: string;
  member: string;
  dueDay: number;
}

const LOAN_DAYS = 14;
const MAX_LOANS_PER_MEMBER = 2;

// REFACTOR: Extract Function. The fine policy is a pure rule that can be tested alone.
export function fineFor(daysLate: number): number {
  return Math.min(Math.max(0, daysLate) * 0.5, 10);
}

// REFACTOR: Extract Class. The catalog owns only book availability.
@Injectable({ providedIn: 'root' })
export class LibraryCatalog {
  private readonly booksState = signal<readonly Book[]>([
    { isbn: '978-0', title: 'Dune', available: true },
    { isbn: '978-1', title: 'Emma', available: true },
    { isbn: '978-2', title: 'Ulysses', available: true },
  ]);
  readonly books = this.booksState.asReadonly();

  find(isbn: string): Book | undefined {
    return this.booksState().find((b) => b.isbn === isbn);
  }

  setAvailable(isbn: string, available: boolean): void {
    this.booksState.update((books) => books.map((b) => (b.isbn === isbn ? { ...b, available } : b)));
  }
}

// REFACTOR: Extract Class. Loans and fines live in their own service, which depends on the
// catalog through inject() instead of sharing fields with the UI.
@Injectable({ providedIn: 'root' })
export class LoanDesk {
  private readonly catalog = inject(LibraryCatalog);
  private readonly loans = signal<readonly Loan[]>([]);
  private readonly fines = signal<ReadonlyMap<string, number>>(new Map());
  readonly totalFines = computed(() => [...this.fines().values()].reduce((a, b) => a + b, 0));

  borrow(isbn: string, member: string, today: number): string {
    const book = this.catalog.find(isbn);
    if (!book?.available) {
      return 'Not available';
    }
    if (this.loans().filter((l) => l.member === member).length >= MAX_LOANS_PER_MEMBER) {
      return `${member} reached the loan limit`;
    }
    this.catalog.setAvailable(isbn, false);
    this.loans.update((loans) => [...loans, { isbn, member, dueDay: today + LOAN_DAYS }]);
    return `${member} borrowed ${book.title}`;
  }

  giveBack(isbn: string, today: number): string | undefined {
    const loan = this.loans().find((l) => l.isbn === isbn);
    if (!loan) {
      return undefined;
    }
    this.loans.update((loans) => loans.filter((l) => l !== loan));
    this.catalog.setAvailable(isbn, true);
    const fine = fineFor(today - loan.dueDay);
    this.fines.update((fines) => new Map(fines).set(loan.member, (fines.get(loan.member) ?? 0) + fine));
    return fine > 0 ? `${loan.member} owes ${fine.toFixed(2)}` : 'Returned on time';
  }
}

// REFACTOR: the component is now a thin view over the services.
@Component({
  selector: 'cs-large-class-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (book of catalog.books(); track book.isbn) {
        <li>{{ book.title }} - {{ book.available ? 'available' : 'on loan' }}</li>
      }
    </ul>
    <p>Fines: {{ desk.totalFines().toFixed(2) }}</p>
    <p>{{ lastMessage() }}</p>
  `,
})
export class LibraryDeskRefactored {
  protected readonly catalog = inject(LibraryCatalog);
  protected readonly desk = inject(LoanDesk);
  protected readonly lastMessage = signal('');

  borrow(isbn: string, member: string, today: number): void {
    this.lastMessage.set(this.desk.borrow(isbn, member, today));
  }

  giveBack(isbn: string, today: number): void {
    const message = this.desk.giveBack(isbn, today);
    if (message !== undefined) {
      this.lastMessage.set(message);
    }
  }
}
