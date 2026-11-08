import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AtmSmelly } from './smelly';
import { Atm } from './refactored';

describe('Side Effects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('logging in behaves the same in both versions', () => {
    const smelly = TestBed.inject(AtmSmelly);
    const atm = TestBed.inject(Atm);
    for (const attempt of ['0000', '1111', '4321']) {
      expect(atm.login(attempt)).toBe(smelly.isPinCorrect(attempt));
    }
    expect(atm.sessionOpen()).toBe(smelly.sessionOpen);
  });

  it('merely asking the smelly question three times locks the account', () => {
    const smelly = TestBed.inject(AtmSmelly);
    ['0000', '0000', '0000'].forEach((pin) => smelly.isPinCorrect(pin));
    expect(smelly.locked).toBe(true);
    expect(smelly.isPinCorrect('4321')).toBe(false);
  });

  it('the refactored query has no side effects', () => {
    const atm = TestBed.inject(Atm);
    ['0000', '0000', '0000'].forEach((pin) => atm.matchesPin(pin));
    expect(atm.isLocked()).toBe(false);
    expect(atm.failedAttempts()).toBe(0);
  });
});
