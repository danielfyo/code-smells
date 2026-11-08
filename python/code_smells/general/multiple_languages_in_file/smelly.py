"""HTML report of a shop's pending orders (smelly version)."""

import sqlite3


# SMELL: Multiple Languages in One File. Python, SQL, HTML and CSS (and JavaScript!) mixed in
# the same function. Each language has its own syntax, escaping rules and tooling; here none
# of them works (no highlighting, no SQL linter, no HTML validator) and on top of that the
# HTML is built without escaping the data.
def pending_orders_report(conn: sqlite3.Connection) -> str:
    rows = conn.execute(
        "SELECT o.id, c.name, o.total FROM orders o JOIN customers c ON c.id = o.customer_id "
        "WHERE o.status = 'pending' ORDER BY o.id"
    ).fetchall()
    html = "<html><head><style>td{padding:4px;border:1px solid #ccc}</style>"
    html += "<script>function hi(r){r.style.background='yellow'}</script></head><body>"
    html += "<h1>Pending orders</h1><table>"
    for order_id, name, total in rows:
        html += f"<tr onclick='hi(this)'><td>{order_id}</td><td>{name}</td><td>{total:.2f}</td></tr>"
    html += "</table></body></html>"
    return html
