"""Refactored version: state is encapsulated in objects that are passed explicitly."""

from collections.abc import Iterator
from dataclasses import dataclass, field
from itertools import count
from typing import Any


@dataclass(frozen=True)
class InvoiceConfig:
    prefix: str = "INV"
    tax_rate: float = 0.21


# REFACTOR: Encapsulate Variable. The counter and the configuration become instance
# state; each company/test creates its own and nobody else can touch it.
@dataclass
class InvoiceIssuer:
    config: InvoiceConfig = field(default_factory=InvoiceConfig)
    _numbers: Iterator[int] = field(default_factory=lambda: count(1))

    def issue(self, net: float) -> dict[str, Any]:
        number = f"{self.config.prefix}-{next(self._numbers):04d}"
        return {"number": number, "total": round(net * (1 + self.config.tax_rate), 2)}

    def with_config(self, config: InvoiceConfig) -> None:
        # REFACTOR: the configuration change is explicit and local to this issuer.
        self.config = config
