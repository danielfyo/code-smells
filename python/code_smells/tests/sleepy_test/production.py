"""Code under test: email sending queue processed by a background thread."""

import queue
import threading


class EmailQueue:
    def __init__(self) -> None:
        self._pending: queue.Queue[str | None] = queue.Queue()
        self.sent: list[str] = []
        self._worker = threading.Thread(target=self._run, daemon=True)
        self._worker.start()

    def enqueue(self, address: str) -> None:
        self._pending.put(address)

    def wait_until_idle(self, timeout: float = 2.0) -> None:
        """Block until every queued email has been sent."""
        done = threading.Event()
        threading.Thread(target=lambda: (self._pending.join(), done.set()), daemon=True).start()
        if not done.wait(timeout):
            raise TimeoutError("the queue did not drain in time")

    def close(self) -> None:
        self._pending.put(None)
        self._worker.join(timeout=2.0)

    def _run(self) -> None:
        while (address := self._pending.get()) is not None:
            self.sent.append(address)  # the real SMTP send would go here
            self._pending.task_done()
        self._pending.task_done()
