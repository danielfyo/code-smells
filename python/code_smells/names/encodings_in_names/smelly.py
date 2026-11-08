"""Patient record in a clinic (smelly version)."""

from abc import ABC, abstractmethod


# SMELL: Encodings in Names. An `I` prefix on an interface with a single implementation,
# Hungarian notation (`strName`, `iAge`, `lstAllergies`, `bIsActive`) and `m_` prefixes.
# The type is already in the annotations; if it changes (e.g. age to `Decimal`) the name lies.
class IPatientRecord(ABC):
    @abstractmethod
    def fnGetSummary(self) -> str: ...


class PatientRecordImpl(IPatientRecord):
    def __init__(self, strName: str, iAge: int, lstAllergies: list[str]) -> None:
        self.m_strName = strName
        self.m_iAge = iAge
        self.m_lstAllergies = lstAllergies
        self.m_bIsActive = True

    def fnGetSummary(self) -> str:
        strAllergies = ", ".join(self.m_lstAllergies) or "none"
        return f"{self.m_strName} ({self.m_iAge}) - allergies: {strAllergies}"
