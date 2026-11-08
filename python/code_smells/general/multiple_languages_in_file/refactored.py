"""HTML report of a shop's pending orders."""

import sqlite3
from dataclasses import dataclass
from html import escape
from pathlib import Path
from string import Template

# REFACTOR: Separate Languages. The SQL lives in `queries/pending_orders.sql`, the HTML/CSS in
# `templates/pending_orders.html`, and Python only orchestrates: it reads data (access layer)
# and fills the template (presentation layer), escaping the values.
_HERE = Path(__file__).parent
PENDING_ORDERS_SQL = (_HERE / "queries" / "pending_orders.sql").read_text(encoding="utf-8")
REPORT_TEMPLATE = Template(
    (_HERE / "templates" / "pending_orders.html").read_text(encoding="utf-8")
)
ROW_TEMPLATE = Template("<tr><td>$id</td><td>$name</td><td>$total</td></tr>")


@dataclass(frozen=True)
class PendingOrder:
    id: int
    customer_name: str
    total: float


def fetch_pending_orders(conn: sqlite3.Connection) -> list[PendingOrder]:
    return [PendingOrder(*row) for row in conn.execute(PENDING_ORDERS_SQL)]


def render_report(orders: list[PendingOrder]) -> str:
    rows = "".join(
        ROW_TEMPLATE.substitute(id=o.id, name=escape(o.customer_name), total=f"{o.total:.2f}")
        for o in orders
    )
    return REPORT_TEMPLATE.substitute(rows=rows)


def pending_orders_report(conn: sqlite3.Connection) -> str:
    return render_report(fetch_pending_orders(conn))
