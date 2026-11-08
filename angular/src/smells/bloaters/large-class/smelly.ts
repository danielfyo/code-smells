import { Component } from '@angular/core';

interface Book {
  isbn: string;
  title: string;
  available: boolean;
}

interface Loan {
  isbn: string;
  member: string;
  dueDay: number;
}

// SMELL: Large Class / God Class. The component stores the catalog, tracks loans, enforces
// the borrowing limit, computes fines, keeps an audit log and renders everything. It changes
// for every library rule and cannot be reused by any other screen.
@Component({
  selector: 'cs-large-class-smelly',
  template: `
    <ul>
      @for (book of books; track book.isbn) {
        <li>{{ book.title }} - {{ book.available ? 'available' : 'on loan' }}</li>
      }
    </ul>
    <p>Fines: {{ totalFines.toFixed(2) }}</p>
    <p>{{ lastMessage }}</p>
  `,
})
export class LibraryDeskSmelly {
  // SMELL: catalog state...
  books: Book[] = [
    { isbn: '978-0', title: 'Dune', available: true },
    { isbn: '978-1', title: 'Emma', available: true },
    { isbn: '978-2', title: 'Ulysses', available: true },
  ];
  // SMELL: ...loan state, fine state and messaging state all in one place.
  loans: Loan[] = [];
  fines = new Map<string, number>();
  totalFines = 0;
  lastMessage = '';
  log: string[] = [];

  borrow(isbn: string, member: string, today: number): void {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book || !book.available) {
      this.lastMessage = 'Not available';
      return;
    }
    if (this.loans.filter((l) => l.member === member).length >= 2) {
      this.lastMessage = member + ' reached the loan limit';
      return;
    }
    book.available = false;
    this.loans.push({ isbn, member, dueDay: today + 14 });
    this.lastMessage = member + ' borrowed ' + book.title;
    this.log.push('borrow ' + isbn);
  }

  giveBack(isbn: string, today: number): void {
    const loan = this.loans.find((l) => l.isbn === isbn);
    if (!loan) {
      return;
    }
    this.loans = this.loans.filter((l) => l !== loan);
    const book = this.books.find((b) => b.isbn === isbn);
    if (book) {
      book.available = true;
    }
    // SMELL: fine policy hard-wired inside the UI class.
    const daysLate = Math.max(0, today - loan.dueDay);
    const fine = Math.min(daysLate * 0.5, 10);
    this.fines.set(loan.member, (this.fines.get(loan.member) ?? 0) + fine);
    this.totalFines = 0;
    this.fines.forEach((value) => (this.totalFines += value));
    this.lastMessage = fine > 0 ? loan.member + ' owes ' + fine.toFixed(2) : 'Returned on time';
    this.log.push('return ' + isbn);
  }
}
