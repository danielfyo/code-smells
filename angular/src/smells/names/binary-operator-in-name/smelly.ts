import { Injectable } from '@angular/core';

export interface SignUp {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class SmellySignUpService {
  readonly saved: SignUp[] = [];
  readonly sentEmails: string[] = [];

  // SMELL: binary operator in name. "validateAndSaveAndNotify" admits it does three things.
  // Callers cannot validate without saving (e.g. to show inline errors) or save without emailing
  // (e.g. an admin import). The return value has to mix errors and success in one string array.
  validateAndSaveAndNotify(signUp: SignUp): string[] {
    const errors: string[] = [];
    if (!signUp.email.includes('@')) errors.push('Invalid email');
    if (signUp.password.length < 8) errors.push('Password too short');
    if (errors.length > 0) return errors;
    this.saved.push(signUp);
    this.sentEmails.push(signUp.email);
    return [];
  }
}
