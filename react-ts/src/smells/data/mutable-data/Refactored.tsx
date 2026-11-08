export interface Player {
  readonly name: string;
  readonly points: number;
}

// REFACTOR: Separate Query from Modifier + Change Reference to Value. Data is
// read-only (`readonly`) and transformations return copies. The render is a
// pure function of its props: it alters nothing in the parent.
export const applyStreakBonus = (player: Player): Player => ({ ...player, points: player.points + 10 });

export function rankPlayers(players: readonly Player[], streakName?: string): Player[] {
  return players
    .map((p) => (p.name === streakName ? applyStreakBonus(p) : p))
    .sort((a, b) => b.points - a.points); // `map` already created a new array: sorting here is safe
}

export function Leaderboard({ players, streakName }: { players: readonly Player[]; streakName?: string }) {
  return (
    <ol>
      {rankPlayers(players, streakName).map((p) => (
        <li key={p.name}>
          {p.name}: {p.points}
        </li>
      ))}
    </ol>
  );
}
