export interface Player {
  name: string;
  points: number;
}

// SMELL: Mutable Data. The function "applies a bonus" by modifying the object
// it receives, and the component sorts the props array IN PLACE with `sort()`.
// The parent sees its data change order and value without doing anything, and
// React cannot detect those changes.
export function applyStreakBonus(player: Player): Player {
  player.points += 10;
  return player;
}

export function Leaderboard({ players, streakName }: { players: Player[]; streakName?: string }) {
  // SMELL: `sort()` sorts the parent's array in place and returns the SAME reference.
  const sorted = players.sort((a, b) => b.points - a.points);
  for (const p of sorted) {
    // SMELL: mutating props during render; every re-render adds another bonus.
    if (p.name === streakName) applyStreakBonus(p);
  }
  return (
    <ol>
      {sorted
        .sort((a, b) => b.points - a.points)
        .map((p) => (
          <li key={p.name}>
            {p.name}: {p.points}
          </li>
        ))}
    </ol>
  );
}
