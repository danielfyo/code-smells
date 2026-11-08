export interface Person {
  title?: string;
  firstName: string;
  lastName: string;
}

// REFACTOR: Replace Boolean Parameter with Named Options (literal union
// types). The call site explains itself: `{ style: "formal" }`.
export type NameStyle = "formal" | "casual";
export type LetterCase = "as-is" | "upper";

export interface NameFormat {
  style: NameStyle;
  letterCase?: LetterCase;
}

const styles: Record<NameStyle, (p: Person) => string> = {
  formal: (p) => `${p.title ? `${p.title} ` : ""}${p.lastName}, ${p.firstName}`,
  casual: (p) => `${p.firstName} ${p.lastName}`,
};

export function formatName(person: Person, { style, letterCase = "as-is" }: NameFormat): string {
  const name = styles[style](person);
  return letterCase === "upper" ? name.toUpperCase() : name;
}

export function Attendees({ people }: { people: Person[] }) {
  return (
    <ul>
      {people.map((p) => (
        <li key={p.lastName}>
          {formatName(p, { style: "formal" })} / {formatName(p, { style: "casual", letterCase: "upper" })}
        </li>
      ))}
    </ul>
  );
}
