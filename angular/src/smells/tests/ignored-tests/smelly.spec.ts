import { PasswordStrengthPipe } from './production';

describe('PasswordStrengthPipe (smelly)', () => {
  const pipe = new PasswordStrengthPipe();

  it('rates short passwords as weak', () => {
    expect(pipe.transform('abc')).toBe('weak');
  });

  // SMELL: ignored test. Skipped with no reason, no ticket and no owner. It has been "temporarily"
  // disabled for months; the rule it guards is no longer protected and nobody remembers why.
  it.skip('rates long mixed passwords as strong', () => {
    expect(pipe.transform('Correct-Horse-9')).toBe('strong');
  });

  // SMELL: and another one, disabled because it "was flaky" (it was not).
  it.skip('rates medium passwords', () => {
    expect(pipe.transform('abcdefG1')).toBe('medium');
  });
});
