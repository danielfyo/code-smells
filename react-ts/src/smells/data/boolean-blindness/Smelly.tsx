export interface Person {
  title?: string;
  firstName: string;
  lastName: string;
}

// SMELL: Boolean Blindness. What does `formatName(p, true, false)` do? At the
// call site the booleans say nothing, it is very easy to swap them and some
// combinations make no sense.
export function formatName(person: Person, formal: boolean, upper: boolean): string {
  const base = formal
    ? `${person.title ? person.title + " " : ""}${person.lastName}, ${person.firstName}`
    : `${person.firstName} ${person.lastName}`;
  return upper ? base.toUpperCase() : base;
}

export function Attendees({ people }: { people: Person[] }) {
  return (
    <ul>
      {people.map((p) => (
        // SMELL: true, false... which one was which?
        <li key={p.lastName}>
          {formatName(p, true, false)} / {formatName(p, false, true)}
        </li>
      ))}
    </ul>
  );
}
