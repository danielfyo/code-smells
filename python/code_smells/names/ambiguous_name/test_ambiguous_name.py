from typing import Any

from . import refactored, smelly


def _fill(store: Any) -> None:
    store.save("Annual Report.pdf", "...")
    store.save("notes.txt", "...")
    store.save(" Board Minutes.docx", "...")


def test_same_normalization() -> None:
    old, new = smelly.DocumentStore(), refactored.DocumentStore()
    _fill(old)
    _fill(new)
    assert old.process() == new.normalize_names() == 2
    assert old.documents.keys() == new.documents.keys()
    assert "annual_report.pdf" in new.documents
