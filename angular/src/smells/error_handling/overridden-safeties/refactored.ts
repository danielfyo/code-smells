import type { ApiProfile } from './model';

// REFACTOR: Restore the safeties. No disabled rules, no `@ts-ignore`, no `!` and no `any`: the
// optional avatar is handled explicitly, so the compiler keeps protecting future changes.
export function initials(profile: ApiProfile): string {
  return profile.displayName
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function avatarUrl(profile: ApiProfile): string {
  return profile.avatar?.url ?? `https://avatars.example.com/initials/${initials(profile)}.svg`;
}
