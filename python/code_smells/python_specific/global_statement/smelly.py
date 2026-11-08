"""Visit counter and cache for a recipe website (smelly version)."""

# SMELL: Global Statement. The functions read and modify module variables with `global`.
# The state is shared by the whole process, the functions are neither reentrant nor
# testable in isolation (the module has to be "reset") and anyone can tamper with it.
visits = 0
recent_recipes: list[str] = []
MAX_RECENT = 3


def register_visit(recipe: str) -> int:
    global visits, recent_recipes
    visits += 1
    recent_recipes = ([recipe] + [r for r in recent_recipes if r != recipe])[:MAX_RECENT]
    return visits


def reset() -> None:
    global visits, recent_recipes
    visits = 0
    recent_recipes = []
