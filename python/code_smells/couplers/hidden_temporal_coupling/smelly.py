"""Smelly version: a payroll process that requires an invisible call order."""


class PayrollRun:
    def __init__(self) -> None:
        self.employees: list[tuple[str, float]] = []
        self.tax_rate: float | None = None
        self.payslips: list[str] = []

    # SMELL: Hidden Temporal Coupling. You must call load_employees() and
    # set_tax_rate() BEFORE generate(). Nothing enforces it: if a step is forgotten,
    # the result is silently wrong (empty list) or it fails halfway.
    def load_employees(self, rows: list[tuple[str, float]]) -> None:
        self.employees = list(rows)

    def set_tax_rate(self, rate: float) -> None:
        self.tax_rate = rate

    def generate(self) -> list[str]:
        self.payslips = [
            f"{name}: {gross * (1 - self.tax_rate):.2f}"  # type: ignore[operator]
            for name, gross in self.employees
        ]
        return self.payslips
