"""Smelly version: one function for every combination of product search filters."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Product:
    name: str
    category: str
    price: float
    in_stock: bool


# SMELL: Combinatorial Explosion. With 3 criteria there are already 7 nearly identical
# functions; a fourth criterion would double that. Every new combination = another copy.
def find_by_category(products: list[Product], category: str) -> list[Product]:
    return [p for p in products if p.category == category]


def find_by_max_price(products: list[Product], max_price: float) -> list[Product]:
    return [p for p in products if p.price <= max_price]


def find_in_stock(products: list[Product]) -> list[Product]:
    return [p for p in products if p.in_stock]


def find_by_category_and_max_price(products, category, max_price):
    return [p for p in products if p.category == category and p.price <= max_price]


def find_by_category_in_stock(products, category):
    return [p for p in products if p.category == category and p.in_stock]


def find_by_max_price_in_stock(products, max_price):
    return [p for p in products if p.price <= max_price and p.in_stock]


def find_by_category_and_max_price_in_stock(products, category, max_price):
    return [p for p in products
            if p.category == category and p.price <= max_price and p.in_stock]
