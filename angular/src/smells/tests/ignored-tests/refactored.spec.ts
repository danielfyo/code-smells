import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PasswordStrengthPipe, Strength } from './production';

// REFACTOR: re-enable the tests (fixing them if needed) or delete them. A test that must stay
// disabled should use `it.todo` / `it.skip` with a reason and a ticket, and be reviewed regularly.
describe('PasswordStrengthPipe (refactored)', () => {
  let pipe: PasswordStrengthPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), PasswordStrengthPipe] });
    pipe = TestBed.inject(PasswordStrengthPipe);
  });

  it.each<[string, Strength]>([
    ['abc', 'weak'],
    ['abcdefgh', 'weak'],
    ['abcdefG1', 'medium'],
    ['Correct-Horse-9', 'strong'],
  ])('rates %s as %s', (password, expected) => {
    expect(pipe.transform(password)).toBe(expected);
  });
});
