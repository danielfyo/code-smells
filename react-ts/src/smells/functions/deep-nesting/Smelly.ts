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

// SMELL: Deep Nesting / Arrow Code. Many levels of `if` form an arrow pointing
// right. The happy path is buried in the middle and each `else` ends up far
// away from the condition it belongs to.
export function editPermission(member: Member | undefined, doc: Doc): string {
  if (member) {
    if (!member.suspended) {
      if (!doc.archived) {
        if (member.id === doc.ownerId || member.role === "owner") {
          return "allowed";
        } else {
          if (doc.sharedWith.includes(member.id)) {
            if (member.role === "editor") {
              if (!doc.locked) {
                return "allowed";
              } else {
                return "denied: document locked";
              }
            } else {
              return "denied: read only";
            }
          } else {
            return "denied: not shared";
          }
        }
      } else {
        return "denied: archived";
      }
    } else {
      return "denied: user suspended";
    }
  } else {
    return "denied: anonymous";
  }
}
