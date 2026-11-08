"""Smelly version: an invoice exporter prepared for futures that never arrive."""

from abc import ABC, abstractmethod


class AbstractExporterFactory(ABC):
    # SMELL: Speculative Generality. An abstract factory with a single implementation,
    # created "in case some day we export to XML, PDF, Excel...".
    @abstractmethod
    def create(self) -> "AbstractExporter": ...


class AbstractExporter(ABC):
    @abstractmethod
    def export(self, invoices: list[dict], options: dict | None = None) -> str: ...

    def before_export(self, invoices: list[dict]) -> list[dict]:
        # SMELL: a hook nobody overrides.
        return invoices

    def after_export(self, output: str) -> str:
        # SMELL: another empty hook "just in case".
        return output


class CsvExporter(AbstractExporter):
    def export(self, invoices: list[dict], options: dict | None = None) -> str:
        # SMELL: `options` accepts separators, encodings... but nobody uses it.
        options = options or {}
        sep = options.get("separator", ";")
        invoices = self.before_export(invoices)
        lines = [sep.join(["number", "total"])]
        lines += [sep.join([i["number"], f"{i['total']:.2f}"]) for i in invoices]
        return self.after_export("\n".join(lines))


class CsvExporterFactory(AbstractExporterFactory):
    def create(self) -> AbstractExporter:
        return CsvExporter()


def export_invoices(invoices: list[dict]) -> str:
    return CsvExporterFactory().create().export(invoices)
