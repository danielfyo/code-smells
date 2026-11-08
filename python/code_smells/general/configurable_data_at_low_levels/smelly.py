"""Weather API client (smelly version)."""

import urllib.parse


class ForecastClient:
    def forecast_url(self, city: str) -> str:
        # SMELL: Configurable Data at Low Levels. The base URL, version, language and units
        # are buried in a low-level method. To point at staging or change the language you
        # have to dig into the code and edit it.
        query = urllib.parse.urlencode({"q": city, "lang": "en", "units": "metric"})
        return f"https://api.weather.example.com/v2/forecast?{query}"

    def retry_delays(self) -> list[float]:
        # SMELL: another hidden configuration constant: 3 retries, 0.5 s base delay.
        return [0.5 * 2**attempt for attempt in range(3)]
