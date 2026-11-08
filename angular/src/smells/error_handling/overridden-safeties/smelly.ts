/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
import type { ApiProfile } from './model';

// SMELL: Overridden Safeties. The lint rules are switched off for the whole file, a
// `@ts-ignore` silences the compiler and `!` / `as any` tell TypeScript "trust me". The type
// checker had spotted that the avatar is optional; now the bug ships and crashes at runtime.
export function avatarUrl(profile: ApiProfile): string {
  return profile.avatar!.url;
}

export function initials(profile: ApiProfile): string {
  // @ts-ignore -- "it works on my machine"
  return (profile as any).displayName.split(' ').map((part) => part[0]).join('').toUpperCase();
}
