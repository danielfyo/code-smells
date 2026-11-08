import { firstAdjacentFreeSeats as smelly } from './smelly';
import { firstAdjacentFreeSeats } from './refactored';

const X = true;
const _ = false;

describe('Status Variable', () => {
  it.each([
    { row: [X, _, X, _, _, _, X], needed: 3 },
    { row: [X, _, X, _, _, X], needed: 3 },
    { row: [_, _], needed: 2 },
    { row: [_], needed: 2 },
    { row: [], needed: 1 },
  ])('both versions find the same block ($needed seats, case %#)', ({ row, needed }) => {
    expect(firstAdjacentFreeSeats(row, needed)).toBe(smelly(row, needed));
  });

  it('returns the first block of free seats', () => {
    expect(firstAdjacentFreeSeats([X, _, X, _, _, _, X], 3)).toBe(3);
  });
});
