// SMELL: prop drilling. "user" and "onLogout" travel through Layout and Sidebar, which don't
// use them, just to reach UserMenu. Every intermediate gets coupled to data it doesn't care about.
export interface User {
  name: string;
  role: "admin" | "customer";
}

interface DrillProps {
  user: User;
  onLogout: () => void;
}

export function App({ user, onLogout }: DrillProps) {
  return <Layout user={user} onLogout={onLogout} />;
}

function Layout({ user, onLogout }: DrillProps) {
  // SMELL: Layout only forwards the props.
  return (
    <div>
      <header>Shop</header>
      <Sidebar user={user} onLogout={onLogout} />
    </div>
  );
}

function Sidebar({ user, onLogout }: DrillProps) {
  // SMELL: Sidebar doesn't use them either; it just passes them down.
  return (
    <nav>
      <a href="/orders">Orders</a>
      <UserMenu user={user} onLogout={onLogout} />
    </nav>
  );
}

function UserMenu({ user, onLogout }: DrillProps) {
  return (
    <div>
      <span>Hi, {user.name}</span>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
}
