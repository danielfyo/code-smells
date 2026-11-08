"""Same result without the intermediate layer."""

from code_smells.couplers.middle_man import refactored, smelly


def test_same_behaviour() -> None:
    manager = smelly.CatalogManager(smelly.ProductRepository())
    repo = refactored.ProductRepository()
    for target in (manager, repo):
        target.save("SHOE", 80.0)
        target.save("SOCK", 5.0)
        target.delete("SOCK")
    manager.apply_discount("SHOE", 25)
    refactored.apply_discount(repo, "SHOE", 25)
    manager.apply_discount("NONE", 25)
    refactored.apply_discount(repo, "NONE", 25)
    assert manager.all_skus() == repo.all_skus() == ["SHOE"]
    assert manager.find("SHOE") == repo.find("SHOE") == 60.0
