# How to build the `sample_app` package (smelly version)

> **SMELL: Multi-Step Build.** Producing a deliverable means following a hand-written
> recipe of steps, with paths, variables and "tricks" only its author knows. Every step is a
> chance to get it wrong (skip one, do them out of order, use another Python version), and
> nothing automates it or lets continuous integration run it.

1. Open a terminal **in the `sample_app` folder** (otherwise the paths do not work).
2. Eyeball `messages.json` to check it is valid JSON (paste it into an online validator).
   Make sure every language has the `greeting` key.
3. Look up the version in `VERSION` and write it down.
4. Create `_version.py` by hand with the content `__version__ = "<the version>"`.
   *Do not forget the quotes!*
5. Create the `../dist` folder if it does not exist (`mkdir ../dist`).
6. Zip `app.py`, `messages.json` and `_version.py` into `../dist/sample_app-<version>.zip`.
   On Windows use "Send to > Compressed folder"; on Mac, the context menu.
   **Do not include `VERSION` or `__pycache__`.**
7. Compute the SHA-256 of the zip (`sha256sum`, `certutil` or `shasum -a 256`, depending on
   your system) and paste it into `../dist/sample_app-<version>.zip.sha256`.
8. Delete `_version.py` so it does not get committed.
9. Tell George so he uploads it to the server (he knows where).
