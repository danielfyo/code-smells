import { Pipe, PipeTransform } from '@angular/core';

// Production code: rates a password as weak, medium or strong.
export type Strength = 'weak' | 'medium' | 'strong';

@Pipe({ name: 'passwordStrength' })
export class PasswordStrengthPipe implements PipeTransform {
  transform(password: string): Strength {
    const checks = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length;
    if (password.length < 8 || checks < 2) return 'weak';
    return password.length >= 12 && checks >= 3 ? 'strong' : 'medium';
  }
}
