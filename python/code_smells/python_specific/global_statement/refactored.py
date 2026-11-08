"""Visit counter and cache for a recipe website."""

from dataclasses import dataclass, field


# REFACTOR: Encapsulate Global State in a Class. The state lives in an instance that is
# created and passed explicitly. Each test (or each tenant of the website) can have its own,
# with no need for `global` or reset functions.
@dataclass
class VisitTracker:
    max_recent: int = 3
    visits: int = 0
    recent_recipes: list[str] = field(default_factory=list)

    def register_visit(self, recipe: str) -> int:
        self.visits += 1
        others = [r for r in self.recent_recipes if r != recipe]
        self.recent_recipes = ([recipe, *others])[: self.max_recent]
        return self.visits
