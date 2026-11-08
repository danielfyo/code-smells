from . import refactored, smelly


def test_same_summary() -> None:
    old = smelly.PatientRecordImpl("Lucy Martin", 34, ["penicillin"])
    new = refactored.PatientRecord("Lucy Martin", 34, ["penicillin"])
    assert old.fnGetSummary() == new.summary() == "Lucy Martin (34) - allergies: penicillin"


def test_no_allergies() -> None:
    assert refactored.PatientRecord("Ralph", 50).summary().endswith("none")
    assert smelly.PatientRecordImpl("Ralph", 50, []).fnGetSummary().endswith("none")
