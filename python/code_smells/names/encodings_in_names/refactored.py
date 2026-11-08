"""Patient record in a clinic."""

from dataclasses import dataclass, field


# REFACTOR: Rename without encodings. No `I`/`Impl`, no Hungarian notation, no `m_`: types
# live in the annotations and state in the instance. Since there is only one
# implementation, the abstract interface was unnecessary (Collapse Hierarchy).
@dataclass
class PatientRecord:
    name: str
    age: int
    allergies: list[str] = field(default_factory=list)
    is_active: bool = True

    def summary(self) -> str:
        allergies = ", ".join(self.allergies) or "none"
        return f"{self.name} ({self.age}) - allergies: {allergies}"
