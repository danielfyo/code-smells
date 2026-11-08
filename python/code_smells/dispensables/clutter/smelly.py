"""Smelly version: a shopping cart full of noise."""

import os  # SMELL: Clutter. Imports that are never used.
import sys  # noqa: F401
from typing import Any, Dict, List, Optional  # noqa: F401


class ShoppingCart(object):  # SMELL: explicit inheritance from object is pointless in Py3.
    def __init__(self):
        # SMELL: redundant initialisations and attributes that are never read.
        self.items = []
        self.items = list()
        self.created_by = None
        pass  # SMELL: useless `pass`.

    def add_item(self, name, price, quantity=1):
        item = {}
        item["name"] = name
        item["price"] = price
        item["quantity"] = quantity
        self.items.append(item)
        return None  # SMELL: explicit and pointless return None.

    def get_total(self):
        total = 0
        tmp = None  # SMELL: unused variable.
        for i in range(0, len(self.items)):  # SMELL: unnecessary index.
            item = self.items[i]
            total = total + (item["price"] * item["quantity"])
        result = total
        return result  # SMELL: intermediate variable that adds nothing.

    def is_empty(self):
        if len(self.items) == 0:
            return True
        else:
            return False  # SMELL: if/else just to return a boolean.
