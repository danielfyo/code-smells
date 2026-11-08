# Code smells in Python

`smelly` / `refactored` examples of the generic smells plus the **20 idiomatic Python smells**.
Full index: [INDEX.md](INDEX.md).

```bash
python3 -m pip install pytest      # or: make install
python3 -m pytest                  # or: make test
python3 -m pytest code_smells/bloaters/long_method -v   # a single smell
```

Every `code_smells/<category>/<slug>/` folder contains:

- `smelly.py` — the smelly code (`# SMELL:` comments).
- `refactored.py` — the fix (`# REFACTOR:` comments naming the technique).
- `test_<slug>.py` — tests comparing both versions or exposing the bug.

In the `tests/` category the production code lives in its own module and the smelly files are the
tests themselves (`test_smelly.py` vs `test_refactored.py`).
