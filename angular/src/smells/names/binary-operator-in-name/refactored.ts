import { Injectable, inject } from '@angular/core';

export interface SignUp {
  email: string;
  password: string;
}

// REFACTOR: Split the function so each name has a single verb. Validation, persistence and
// notification are separate operations; the use case composes them explicitly.
export function validateSignUp(signUp: SignUp): string[] {
  const errors: string[] = [];
  if (!signUp.email.includes('@')) errors.push('Invalid email');
  if (signUp.password.length < 8) errors.push('Password too short');
  return errors;
}

@Injectable({ providedIn: 'root' })
export class AccountRepository {
  readonly saved: SignUp[] = [];
  save(signUp: SignUp): void {
    this.saved.push(signUp);
  }
}

@Injectable({ providedIn: 'root' })
export class WelcomeMailer {
  readonly sentEmails: string[] = [];
  send(email: string): void {
    this.sentEmails.push(email);
  }
}

@Injectable({ providedIn: 'root' })
export class RegisterAccount {
  private readonly accounts = inject(AccountRepository);
  private readonly mailer = inject(WelcomeMailer);

  register(signUp: SignUp): string[] {
    const errors = validateSignUp(signUp);
    if (errors.length > 0) return errors;
    this.accounts.save(signUp);
    this.mailer.send(signUp.email);
    return [];
  }
}
