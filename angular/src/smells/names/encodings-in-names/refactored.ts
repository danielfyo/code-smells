import { Injectable, computed, signal } from '@angular/core';

// REFACTOR: Rename and drop the encodings. The compiler carries the types; names carry meaning.
// `User` instead of `IUserInterface`, `name` instead of `strName`, `users` instead of `m_arrUsersList`.
export interface User {
  name: string;
  email: string;
  age: number;
  active: boolean;
}

const ADULT_AGE = 18;

@Injectable({ providedIn: 'root' })
export class UserDirectory {
  private readonly users = signal<readonly User[]>([]);

  readonly activeNames = computed(() => this.users().filter((user) => user.active).map((user) => user.name));
  readonly adultCount = computed(() => this.users().filter((user) => user.age >= ADULT_AGE).length);

  add(user: User): void {
    this.users.update((users) => [...users, user]);
  }
}
