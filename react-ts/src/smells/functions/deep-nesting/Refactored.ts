export interface Member {
  id: string;
  role: "owner" | "editor" | "viewer";
  suspended: boolean;
}

export interface Doc {
  ownerId: string;
  locked: boolean;
  archived: boolean;
  sharedWith: string[];
}

// REFACTOR: Replace Nested Conditional with Guard Clauses. Each rejection case
// exits as soon as it is detected; the code reads top to bottom, flat, and the
// happy path sits at the end without indentation.
export function editPermission(member: Member | undefined, doc: Doc): string {
  if (!member) return "denied: anonymous";
  if (member.suspended) return "denied: user suspended";
  if (doc.archived) return "denied: archived";
  if (member.id === doc.ownerId || member.role === "owner") return "allowed";
  if (!doc.sharedWith.includes(member.id)) return "denied: not shared";
  if (member.role !== "editor") return "denied: read only";
  if (doc.locked) return "denied: document locked";
  return "allowed";
}
