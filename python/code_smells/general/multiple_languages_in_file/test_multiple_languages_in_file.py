import sqlite3

import pytest

from . import refactored, smelly


@pytest.fixture
def conn() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:")
    connection.executescript(
        """
        CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INT, status TEXT, total REAL);
        INSERT INTO customers VALUES (1, 'Anna'), (2, 'Tom & Jerry');
        INSERT INTO orders VALUES (10, 1, 'pending', 20.5), (11, 2, 'sent', 9),
                                  (12, 2, 'pending', 7.25);
        """
    )
    return connection


def test_same_orders_listed(conn: sqlite3.Connection) -> None:
    old, new = smelly.pending_orders_report(conn), refactored.pending_orders_report(conn)
    for fragment in ("<td>10</td>", "<td>20.50</td>", "<td>12</td>", "<td>7.25</td>"):
        assert fragment in old and fragment in new
    assert "<td>11</td>" not in new


def test_refactored_escapes_html(conn: sqlite3.Connection) -> None:
    assert "Tom & Jerry" in smelly.pending_orders_report(conn)  # invalid HTML
    assert "Tom &amp; Jerry" in refactored.pending_orders_report(conn)
