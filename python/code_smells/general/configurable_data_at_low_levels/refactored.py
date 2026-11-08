"""Weather API client."""

import urllib.parse
from dataclasses import dataclass


# REFACTOR: Move Configuration Up / Introduce Parameter Object. Configurable data is grouped
# in a configuration object whose defaults are visible in a single high-level place, and it
# is injected into the client.
@dataclass(frozen=True)
class ForecastConfig:
    base_url: str = "https://api.weather.example.com/v2"
    language: str = "en"
    units: str = "metric"
    max_retries: int = 3
    retry_base_seconds: float = 0.5


class ForecastClient:
    def __init__(self, config: ForecastConfig | None = None) -> None:
        self._config = config or ForecastConfig()

    def forecast_url(self, city: str) -> str:
        query = urllib.parse.urlencode(
            {"q": city, "lang": self._config.language, "units": self._config.units}
        )
        return f"{self._config.base_url}/forecast?{query}"

    def retry_delays(self) -> list[float]:
        base = self._config.retry_base_seconds
        return [base * 2**attempt for attempt in range(self._config.max_retries)]
