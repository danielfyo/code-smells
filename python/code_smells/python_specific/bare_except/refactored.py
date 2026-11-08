"""Reading the configuration of an IoT sensor."""

import json
import logging

logger = logging.getLogger(__name__)


# REFACTOR: Catch Specific Exceptions. Only the errors we know how to handle are caught
# (invalid JSON, missing keys, non-numeric value) and they are logged. Everything else
# (bugs, Ctrl+C, SystemExit) propagates as it should.
def read_threshold(raw_config: str, default: float = 25.0) -> float:
    try:
        config = json.loads(raw_config)
        return float(config["sensor"]["threshold"])
    except (json.JSONDecodeError, KeyError, TypeError, ValueError) as error:
        logger.warning("Invalid sensor configuration (%s); using %s", error, default)
        return default
