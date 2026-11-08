import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellySignUpService } from './smelly';
import { AccountRepository, RegisterAccount, SignUp, validateSignUp, WelcomeMailer } from './refactored';

describe('binary-operator-in-name', () => {
  const valid: SignUp = { email: 'ana@shop.test', password: 'long-enough' };
  const invalid: SignUp = { email: 'ana', password: 'short' };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('both versions reject invalid sign-ups without saving', () => {
    const smelly = TestBed.inject(SmellySignUpService);
    expect(smelly.validateAndSaveAndNotify(invalid)).toEqual(['Invalid email', 'Password too short']);
    expect(smelly.saved).toEqual([]);
    expect(TestBed.inject(RegisterAccount).register(invalid)).toEqual(['Invalid email', 'Password too short']);
    expect(TestBed.inject(AccountRepository).saved).toEqual([]);
  });

  it('both versions save and notify valid sign-ups', () => {
    const smelly = TestBed.inject(SmellySignUpService);
    expect(smelly.validateAndSaveAndNotify(valid)).toEqual([]);
    expect(smelly.sentEmails).toEqual(['ana@shop.test']);
    expect(TestBed.inject(RegisterAccount).register(valid)).toEqual([]);
    expect(TestBed.inject(AccountRepository).saved).toEqual([valid]);
    expect(TestBed.inject(WelcomeMailer).sentEmails).toEqual(['ana@shop.test']);
  });

  it('refactored: validation can be used on its own, with no side effects', () => {
    expect(validateSignUp(invalid)).toHaveLength(2);
    expect(TestBed.inject(AccountRepository).saved).toEqual([]);
  });
});
