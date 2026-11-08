export interface Preferences {
  language: "es" | "en";
  theme: "light" | "dark";
}

export interface User {
  name: string;
  preferences?: Partial<Preferences>;
}

// REFACTOR: Introduce Special Case (Null Object). Instead of returning `null`,
// the lookup always returns a valid user: a real one or the guest.
// Preferences are resolved with defaults in a single place.
const DEFAULT_PREFERENCES: Preferences = { language: "es", theme: "light" };

export interface ResolvedUser {
  name: string;
  preferences: Preferences;
}

export const GUEST: ResolvedUser = { name: "guest", preferences: DEFAULT_PREFERENCES };

export function findUser(users: User[], name: string): ResolvedUser {
  const user = users.find((u) => u.name === name);
  if (!user) return GUEST;
  return { name: user.name, preferences: { ...DEFAULT_PREFERENCES, ...user.preferences } };
}

const GREETINGS: Record<Preferences["language"], string> = { es: "Hola", en: "Hello" };

export function Greeting({ users, name }: { users: User[]; name: string }) {
  const { name: displayName, preferences } = findUser(users, name);
  return (
    <p data-theme={preferences.theme}>
      {GREETINGS[preferences.language]}, {displayName}
    </p>
  );
}
