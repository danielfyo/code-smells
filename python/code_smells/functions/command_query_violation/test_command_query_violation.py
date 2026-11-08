"""Same service order; and peeking at the next one no longer consumes it."""

from code_smells.functions.command_query_violation import refactored, smelly


def test_same_processing_order() -> None:
    old, new = smelly.TicketQueue(), refactored.TicketQueue()
    for t in ("T1", "T2", "T3"):
        old.add(t)
        new.add(t)
    served_old = [old.next_ticket() for _ in range(3)]
    served_new = []
    for _ in range(3):
        served_new.append(new.peek())
        new.take_next()
    assert served_old == served_new == ["T1", "T2", "T3"]
    assert old.pending() == new.pending() == 0


def test_smelly_peeking_loses_tickets() -> None:
    old = smelly.TicketQueue()
    old.add("T1")
    old.add("T2")
    old.next_ticket()  # "I only wanted to look"
    assert old.pending() == 1

    new = refactored.TicketQueue()
    new.add("T1")
    new.add("T2")
    new.peek()
    new.peek()
    assert new.pending() == 2
