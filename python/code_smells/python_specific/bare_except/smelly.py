"""Reading the configuration of an IoT sensor (smelly version)."""

import json


def read_threshold(raw_config: str, default: float = 25.0) -> float:
    # SMELL: Bare Except. `except:` catches EVERYTHING: the expected JSON errors, but also
    # programming mistakes (NameError, TypeError), KeyboardInterrupt and SystemExit. The
    # program cannot be interrupted with Ctrl+C here and real bugs hide behind a default.
    try:
        config = json.loads(raw_config)
        return float(config["sensor"]["threshold"])
    except:  # noqa: E722
        return default
