import { Injectable } from '@angular/core';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}

// SMELL: names at the wrong level of abstraction. The service and its methods are named after
// the mechanism (localStorage, JSON) rather than the concept (preferences). Moving to IndexedDB
// or a backend would force renaming every caller, or leave names that lie.
@Injectable({ providedIn: 'root' })
export class SmellyLocalStorageJsonService {
  writeLocalStorageJson(value: UserPreferences): void {
    localStorage.setItem('prefs', JSON.stringify(value));
  }

  readLocalStorageJsonOrDefault(): UserPreferences {
    const raw = localStorage.getItem('prefs');
    return raw ? (JSON.parse(raw) as UserPreferences) : { theme: 'light', language: 'en' };
  }
}
