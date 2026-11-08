export interface Preferences {
  language: string | null;
  theme: string | null;
}

export interface User {
  name: string;
  preferences: Preferences | null;
}

// SMELL: Null Abuse. The lookup returns `null` and every consumer has to check
// for null at every level. Forgetting a single check is enough to get a
// "Cannot read properties of null" in production.
export function findUser(users: User[], name: string): User | null {
  for (const u of users) if (u.name === name) return u;
  return null;
}

export function Greeting({ users, name }: { users: User[]; name: string }) {
  const user = findUser(users, name);
  let greeting = "Hola";
  let displayName = "guest";
  let theme = "light";
  if (user !== null) {
    displayName = user.name;
    if (user.preferences !== null) {
      if (user.preferences.language !== null && user.preferences.language === "en") greeting = "Hello";
      if (user.preferences.theme !== null) theme = user.preferences.theme;
    }
  }
  return (
    <p data-theme={theme}>
      {greeting}, {displayName}
    </p>
  );
}
