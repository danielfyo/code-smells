"""Smelly version: an "anaemic" subscription with its logic living elsewhere."""

from datetime import date, timedelta


class Subscription:
    # SMELL: Data Class. Only getters and setters; it protects no rule. Anyone can
    # leave it in an invalid state (end before start, negative price).
    def __init__(self, plan: str, start: date, end: date, monthly_price: float) -> None:
        self._plan = plan
        self._start = start
        self._end = end
        self._monthly_price = monthly_price

    def get_plan(self) -> str:
        return self._plan

    def get_start(self) -> date:
        return self._start

    def get_end(self) -> date:
        return self._end

    def set_end(self, end: date) -> None:
        self._end = end

    def get_monthly_price(self) -> float:
        return self._monthly_price


class SubscriptionService:
    # SMELL: the logic that should live in Subscription is here, operating on its
    # data from the outside (Feature Envy as an associated symptom).
    def is_active(self, sub: Subscription, on: date) -> bool:
        return sub.get_start() <= on <= sub.get_end()

    def renew(self, sub: Subscription, months: int) -> None:
        sub.set_end(sub.get_end() + timedelta(days=30 * months))

    def renewal_price(self, sub: Subscription, months: int) -> float:
        discount = 0.15 if months >= 12 else 0.0
        return round(sub.get_monthly_price() * months * (1 - discount), 2)
