// REFACTOR: Extract Class. Each responsibility of the God Class moves to a
// cohesive class; LibraryManager remains as a thin facade.

export class Catalog {
  private books = new Map<string, { title: string; available: boolean }>();

  add(isbn: string, title: string): void {
    this.books.set(isbn, { title, available: true });
  }
  isAvailable(isbn: string): boolean {
    return this.books.get(isbn)?.available ?? false;
  }
  setAvailable(isbn: string, available: boolean): void {
    const book = this.books.get(isbn);
    if (book) book.available = available;
  }
  get size(): number {
    return this.books.size;
  }
  get lentCount(): number {
    return [...this.books.values()].filter((b) => !b.available).length;
  }
}

export class MemberRegistry {
  private members = new Map<string, { name: string; email: string }>();

  register(id: string, name: string, email: string): void {
    if (!email.includes("@")) throw new Error("Invalid email");
    this.members.set(id, { name, email });
  }
  has(id: string): boolean {
    return this.members.has(id);
  }
  get size(): number {
    return this.members.size;
  }
}

// REFACTOR: the fine policy is an object of its own, and replaceable.
export class FineLedger {
  private fines = new Map<string, number>();
  static readonly PER_LATE_DAY = 0.5;

  charge(memberId: string, lateDays: number): void {
    if (lateDays <= 0) return;
    this.fines.set(memberId, this.of(memberId) + lateDays * FineLedger.PER_LATE_DAY);
  }
  pay(memberId: string): void {
    this.fines.delete(memberId);
  }
  of(memberId: string): number {
    return this.fines.get(memberId) ?? 0;
  }
}

export class LoanService {
  private loans: { isbn: string; memberId: string; dueDay: number }[] = [];
  static readonly LOAN_DAYS = 14;

  constructor(
    private readonly catalog: Catalog,
    private readonly members: MemberRegistry,
    private readonly fines: FineLedger,
  ) {}

  lend(isbn: string, memberId: string, today: number): void {
    if (!this.catalog.isAvailable(isbn)) throw new Error("Book not available");
    if (!this.members.has(memberId)) throw new Error("Unknown member");
    if (this.fines.of(memberId) > 0) throw new Error("Member has unpaid fines");
    this.catalog.setAvailable(isbn, false);
    this.loans.push({ isbn, memberId, dueDay: today + LoanService.LOAN_DAYS });
  }

  giveBack(isbn: string, today: number): void {
    const loan = this.loans.find((l) => l.isbn === isbn);
    if (!loan) throw new Error("Unknown loan");
    this.loans = this.loans.filter((l) => l !== loan);
    this.catalog.setAvailable(isbn, true);
    this.fines.charge(loan.memberId, today - loan.dueDay);
  }
}

// REFACTOR: a facade that composes the pieces and keeps the original public API.
export class LibraryManager {
  private readonly catalog = new Catalog();
  private readonly members = new MemberRegistry();
  private readonly fines = new FineLedger();
  private readonly loans = new LoanService(this.catalog, this.members, this.fines);

  addBook(isbn: string, title: string): void {
    this.catalog.add(isbn, title);
  }
  addMember(id: string, name: string, email: string): void {
    this.members.register(id, name, email);
  }
  lend(isbn: string, memberId: string, today: number): void {
    this.loans.lend(isbn, memberId, today);
  }
  giveBack(isbn: string, today: number): void {
    this.loans.giveBack(isbn, today);
  }
  payFine(memberId: string): void {
    this.fines.pay(memberId);
  }
  fineOf(memberId: string): number {
    return this.fines.of(memberId);
  }
  isAvailable(isbn: string): boolean {
    return this.catalog.isAvailable(isbn);
  }
  report(): string {
    return `Books: ${this.catalog.size}, lent: ${this.catalog.lentCount}, members: ${this.members.size}`;
  }
}
