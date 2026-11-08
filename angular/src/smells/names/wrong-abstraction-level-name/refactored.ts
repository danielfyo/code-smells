import { Injectable } from '@angular/core';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = { theme: 'light', language: 'en' };
const STORAGE_KEY = 'prefs';

// REFACTOR: Rename to the domain concept. Callers "save" and "load" preferences; how they are
// persisted is an implementation detail hidden inside the service and free to change.
@Injectable({ providedIn: 'root' })
export class UserPreferencesStore {
  save(preferences: UserPreferences): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }

  load(): UserPreferences {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UserPreferences) : DEFAULT_PREFERENCES;
  }
}
