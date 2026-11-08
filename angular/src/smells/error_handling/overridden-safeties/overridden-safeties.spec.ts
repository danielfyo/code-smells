import type { ApiProfile } from './model';
import { avatarUrl as smellyAvatar, initials as smellyInitials } from './smelly';
import { avatarUrl, initials } from './refactored';

const withAvatar: ApiProfile = { displayName: 'Jon Arrieta', avatar: { url: 'https://cdn.test/jon.png' } };
const withoutAvatar: ApiProfile = { displayName: 'mia lopez' };

describe('Overridden Safeties', () => {
  it('both versions agree on the happy path', () => {
    expect(avatarUrl(withAvatar)).toBe(smellyAvatar(withAvatar));
    expect(initials(withoutAvatar)).toBe(smellyInitials(withoutAvatar));
  });

  it('the silenced compiler warning becomes a runtime crash', () => {
    expect(() => smellyAvatar(withoutAvatar)).toThrow(TypeError);
  });

  it('the refactored version handles the optional avatar', () => {
    expect(avatarUrl(withoutAvatar)).toBe('https://avatars.example.com/initials/ML.svg');
  });
});
