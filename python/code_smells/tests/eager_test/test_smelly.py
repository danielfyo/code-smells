"""Smelly tests: Eager Test."""

import pytest

from .production import TodoList


# SMELL: Eager Test. A single test checks adding, validating, completing, listing pending
# tasks and clearing. If it fails, the name does not say which behavior broke; if it fails
# early, the rest is never checked; and it is hard to read as a specification.
def test_todo_list() -> None:
    todo = TodoList()
    todo.add("buy bread")
    todo.add("  call the plumber ")
    assert todo.pending() == ["buy bread", "call the plumber"]
    with pytest.raises(ValueError):
        todo.add("   ")
    todo.complete("buy bread")
    assert todo.pending() == ["call the plumber"]
    assert todo.clear_done() == 1
    assert len(todo.tasks) == 1
