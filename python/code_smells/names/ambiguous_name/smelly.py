"""Document management in a repository (smelly version)."""


class DocumentStore:
    def __init__(self) -> None:
        self.documents: dict[str, str] = {}

    def save(self, name: str, content: str) -> None:
        self.documents[name] = content

    # SMELL: Ambiguous Name. Does `do_rename` rename the document, copy it under another
    # name, or return a new name? You have to read the body to find out.
    def do_rename(self, name: str, new: str) -> None:
        self.documents[new] = self.documents.pop(name)

    # SMELL: `process` is the ambiguous name par excellence: process what? how? Here it
    # actually normalizes file names and returns how many it changed.
    def process(self) -> int:
        changed = 0
        for name in list(self.documents):
            normalized = name.strip().lower().replace(" ", "_")
            if normalized != name:
                self.do_rename(name, normalized)
                changed += 1
        return changed
