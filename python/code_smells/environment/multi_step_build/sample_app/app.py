"""Sample application that gets packaged: shows a translated greeting."""

import json
from pathlib import Path


def greet(lang: str = "en") -> str:
    messages = json.loads((Path(__file__).parent / "messages.json").read_text(encoding="utf-8"))
    return messages[lang]["greeting"]
