// SMELL: Large Class / God Class. LibraryManager stores books, members, loans
// and fines, and also produces reports. Any change in any of those areas forces
// us to touch (and re-test) this very same class.
export class LibraryManager {
  private books = new Map<string, { isbn: string; title: string; available: boolean }>();
  private members = new Map<string, { id: string; name: string; email: string }>();
  private loans: { isbn: string; memberId: string; dueDay: number }[] = [];
  private fines = new Map<string, number>();
  private log: string[] = [];

  addBook(isbn: string, title: string): void {
    this.books.set(isbn, { isbn, title, available: true });
    this.log.push(`book:${isbn}`);
  }

  addMember(id: string, name: string, email: string): void {
    // SMELL: member validation mixed with book management.
    if (!email.includes("@")) throw new Error("Invalid email");
    this.members.set(id, { id, name, email });
    this.log.push(`member:${id}`);
  }

  lend(isbn: string, memberId: string, today: number): void {
    const book = this.books.get(isbn);
    if (!book || !book.available) throw new Error("Book not available");
    if (!this.members.has(memberId)) throw new Error("Unknown member");
    if ((this.fines.get(memberId) ?? 0) > 0) throw new Error("Member has unpaid fines");
    book.available = false;
    this.loans.push({ isbn, memberId, dueDay: today + 14 });
    this.log.push(`lend:${isbn}:${memberId}`);
  }

  giveBack(isbn: string, today: number): void {
    const index = this.loans.findIndex((l) => l.isbn === isbn);
    if (index < 0) throw new Error("Unknown loan");
    const loan = this.loans[index];
    this.loans.splice(index, 1);
    this.books.get(isbn)!.available = true;
    // SMELL: the fine policy lives here too.
    const lateDays = Math.max(0, today - loan.dueDay);
    if (lateDays > 0) {
      this.fines.set(loan.memberId, (this.fines.get(loan.memberId) ?? 0) + lateDays * 0.5);
    }
    this.log.push(`return:${isbn}`);
  }

  payFine(memberId: string): void {
    this.fines.delete(memberId);
  }

  fineOf(memberId: string): number {
    return this.fines.get(memberId) ?? 0;
  }

  isAvailable(isbn: string): boolean {
    return this.books.get(isbn)?.available ?? false;
  }

  // SMELL: and on top of that it generates reports.
  report(): string {
    const lent = [...this.books.values()].filter((b) => !b.available).length;
    return `Books: ${this.books.size}, lent: ${lent}, members: ${this.members.size}`;
  }
}
