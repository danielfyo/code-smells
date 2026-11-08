// SMELL: names at the wrong abstraction level: they leak the implementation
// (localStorage, JSON) instead of the domain concept (saving preferences).
export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
}

export interface PreferencesRepository {
  writeJsonToLocalStorage(prefs: UserPreferences): void;
  readJsonFromLocalStorage(): UserPreferences | null;
}

export class LocalStoragePreferences implements PreferencesRepository {
  writeJsonToLocalStorage(prefs: UserPreferences): void {
    localStorage.setItem("prefs", JSON.stringify(prefs));
  }

  readJsonFromLocalStorage(): UserPreferences | null {
    const raw = localStorage.getItem("prefs");
    return raw ? (JSON.parse(raw) as UserPreferences) : null;
  }
}
// SMELL: if preferences move to a server tomorrow, the "PreferencesRepository" interface
// would have lying methods (writeJsonToLocalStorage making an HTTP request).
