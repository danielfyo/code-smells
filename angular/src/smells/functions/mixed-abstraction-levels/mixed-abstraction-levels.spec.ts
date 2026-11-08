import type { Draft } from './model';
import { publish as smelly } from './smelly';
import { publish, slugify } from './refactored';

const draft: Draft = {
  title: '  Crème brûlée: a quick guide! ',
  body: 'First, warm the cream.\n\nThen caramelize the sugar.',
  author: 'Lucia',
};

describe('Mixed Levels of Abstraction', () => {
  it('both versions publish the same article', () => {
    expect(publish(draft)).toEqual(smelly(draft));
  });

  it('both versions reject incomplete drafts', () => {
    const empty = { ...draft, body: ' ' };
    expect(() => smelly(empty)).toThrow('Title and body are required');
    expect(() => publish(empty)).toThrow('Title and body are required');
  });

  it('slugifies accented titles', () => {
    expect(publish(draft).slug).toBe('creme-brulee-a-quick-guide');
  });

  it('low-level helpers are testable on their own', () => {
    expect(slugify('Hello,  World!')).toBe('hello-world');
  });
});
