"""Unit tests (unittest) for the sample module."""

import unittest

from pricing import apply_discount


class ApplyDiscountTest(unittest.TestCase):
    def test_known_code(self) -> None:
        self.assertEqual(apply_discount(50.0, "BLACKFRIDAY"), 30.0)

    def test_unknown_code_keeps_price(self) -> None:
        self.assertEqual(apply_discount(50.0, "NOPE"), 50.0)


if __name__ == "__main__":
    unittest.main()
