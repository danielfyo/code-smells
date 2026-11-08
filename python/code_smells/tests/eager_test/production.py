"""Code under test: a to-do list."""

from dataclasses import dataclass, field


@dataclass
class Task:
    title: str
    done: bool = False


@dataclass
class TodoList:
    tasks: list[Task] = field(default_factory=list)

    def add(self, title: str) -> Task:
        if not title.strip():
            raise ValueError("the title cannot be empty")
        task = Task(title.strip())
        self.tasks.append(task)
        return task

    def complete(self, title: str) -> None:
        next(t for t in self.tasks if t.title == title).done = True

    def pending(self) -> list[str]:
        return [t.title for t in self.tasks if not t.done]

    def clear_done(self) -> int:
        before = len(self.tasks)
        self.tasks = [t for t in self.tasks if not t.done]
        return before - len(self.tasks)
