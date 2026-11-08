from . import refactored, smelly


def test_same_defaults() -> None:
    old, new = smelly.ForecastClient(), refactored.ForecastClient()
    assert old.forecast_url("Seville") == new.forecast_url("Seville")
    assert old.retry_delays() == new.retry_delays() == [0.5, 1.0, 2.0]


def test_refactored_is_configurable_from_the_top() -> None:
    config = refactored.ForecastConfig(
        base_url="https://staging.example.com/v2", language="fr", max_retries=2
    )
    client = refactored.ForecastClient(config)
    assert client.forecast_url("Lisbon").startswith("https://staging.example.com/v2/forecast?")
    assert "lang=fr" in client.forecast_url("Lisbon")
    assert client.retry_delays() == [0.5, 1.0]
