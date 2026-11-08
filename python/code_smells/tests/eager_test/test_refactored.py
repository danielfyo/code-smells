"""Clean tests: one behavior per test."""

import pytest

from .production import TodoList


# REFACTOR: Split Test (one concept per test) + shared fixture. Each test is named after the
# behavior it specifies and fails independently.
@pytest.fixture
def todo() -> TodoList:
    todo = TodoList()
    todo.add("buy bread")
    todo.add("call the plumber")
    return todo


def test_add_trims_title() -> None:
    assert TodoList().add("  water the plants ").title == "water the plants"


def test_add_rejects_blank_title() -> None:
    with pytest.raises(ValueError):
        TodoList().add("   ")


def test_new_tasks_are_pending(todo: TodoList) -> None:
    assert todo.pending() == ["buy bread", "call the plumber"]


def test_completed_task_is_not_pending(todo: TodoList) -> None:
    todo.complete("buy bread")
    assert todo.pending() == ["call the plumber"]


def test_clear_done_removes_only_completed_tasks(todo: TodoList) -> None:
    todo.complete("buy bread")
    assert todo.clear_done() == 1
    assert [t.title for t in todo.tasks] == ["call the plumber"]
