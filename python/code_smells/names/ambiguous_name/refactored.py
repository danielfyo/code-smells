"""Document management in a repository."""


class DocumentStore:
    def __init__(self) -> None:
        self.documents: dict[str, str] = {}

    def save(self, name: str, content: str) -> None:
        self.documents[name] = content

    # REFACTOR: Rename Method. `move` makes it clear the document changes name (it is not
    # copied) and `new_name` removes the parameter's ambiguity.
    def move(self, name: str, new_name: str) -> None:
        self.documents[new_name] = self.documents.pop(name)

    # REFACTOR: Rename Method. The name says exactly what it does and what it returns.
    def normalize_names(self) -> int:
        """Lowercase names with underscores; return how many were changed."""
        renamed_count = 0
        for name in list(self.documents):
            normalized = name.strip().lower().replace(" ", "_")
            if normalized != name:
                self.move(name, normalized)
                renamed_count += 1
        return renamed_count
