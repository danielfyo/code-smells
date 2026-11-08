"""Sales report by region (smelly version)."""


# SMELL: Short Names in Long Scopes. `r`, `s`, `t`, `m` live for the whole function and are
# used far from where they are defined. A single letter is fine for an index in a two-line
# loop, not for variables with such a long scope: by the end you no longer remember them.
def sales_report(rows: list[tuple[str, str, float]]) -> list[str]:
    r: dict[str, float] = {}
    s = 0.0
    m = ("", 0.0)
    for x in rows:
        _, g, a = x
        r[g] = r.get(g, 0.0) + a
        s += a
    for g, a in r.items():
        if a > m[1]:
            m = (g, a)
    t = []
    for g in sorted(r):
        p = r[g] / s * 100 if s else 0.0
        t.append(f"{g}: {r[g]:.2f} ({p:.1f}%)")
    # ...many lines later, what was `m`? and `s`?
    t.append(f"TOTAL: {s:.2f}")
    t.append(f"BEST: {m[0]}")
    return t
