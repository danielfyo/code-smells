import { examples as smelly, formatEventDate as smellyFormat } from './smelly';
import { examples as refactored } from './refactored';

const iso = '2026-09-14T19:05:00Z';

describe('Boolean Blindness', () => {
  it.each(['ticket', 'calendar', 'boardingPass'] as const)('both versions format the %s the same way', (kind) => {
    expect(refactored[kind](iso)).toBe(smelly[kind](iso));
  });

  it('readable call sites produce the expected text', () => {
    expect(refactored.ticket(iso)).toBe('14/9/2026 7:05 PM');
    expect(refactored.boardingPass(iso)).toBe('14/9/2026 19:05');
  });

  it('swapped smelly flags compile and silently change the output', () => {
    expect(smellyFormat(iso, false, true)).toBe('14/9/2026');
  });
});
