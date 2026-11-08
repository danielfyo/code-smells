import { createContext, useContext, type ReactNode } from "react";

export interface User {
  name: string;
  role: "admin" | "customer";
}

interface SessionValue {
  user: User;
  onLogout: () => void;
}

// REFACTOR: introduce a context scoped to the session. Intermediate components no longer
// know about "user" or "onLogout"; only whoever needs them consumes them.
const SessionContext = createContext<SessionValue | null>(null);

function useSession(): SessionValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <SessionProvider>");
  return session;
}

function SessionProvider({ children, ...value }: SessionValue & { children: ReactNode }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function App({ user, onLogout }: SessionValue) {
  return (
    <SessionProvider user={user} onLogout={onLogout}>
      <Layout />
    </SessionProvider>
  );
}

function Layout() {
  return (
    <div>
      <header>Shop</header>
      <Sidebar />
    </div>
  );
}

function Sidebar() {
  return (
    <nav>
      <a href="/orders">Orders</a>
      <UserMenu />
    </nav>
  );
}

function UserMenu() {
  const { user, onLogout } = useSession();
  return (
    <div>
      <span>Hi, {user.name}</span>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
}
