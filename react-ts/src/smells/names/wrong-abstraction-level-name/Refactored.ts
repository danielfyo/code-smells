export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
}

// REFACTOR: the interface speaks about the concept (save/load), not the mechanism.
// Any implementation (localStorage, API, memory) fits without the names lying.
export interface PreferencesRepository {
  save(prefs: UserPreferences): void;
  load(): UserPreferences | null;
}

const STORAGE_KEY = "prefs";

export class LocalStoragePreferences implements PreferencesRepository {
  save(prefs: UserPreferences): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  load(): UserPreferences | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserPreferences) : null;
  }
}
