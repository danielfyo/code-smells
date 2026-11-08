# How to run the `sample_project` tests (smelly version)

> **SMELL: Multi-Step Tests.** There is no single command that runs *all* the checks. There
> are three kinds of tests (unit tests, doctests and data validation), each with its own
> invocation, working directory and way of "reading" the result. People run only the one
> they remember, CI runs a different one, and failures slip through.

1. `cd sample_project` (the unit tests import `pricing` through a relative path).
2. Run the unit tests: `python -m unittest pricing_unit`.
3. **Also** run the doctests, which are *not* run by the previous step:
   `python -m doctest -v pricing.py` and check by hand that it ends with
   "Test passed" (without `-v` and with everything passing it prints nothing; when it fails,
   some old versions of the CI script do not return an error either).
4. Run the data validator: `python check_discounts.py`. If it prints
   "Discounts out of range", that is a failure even if the other two passed.
5. If you touched `discounts.json`, run step 3 again (the doctests depend on it).
6. Post in the team channel which steps you ran.
