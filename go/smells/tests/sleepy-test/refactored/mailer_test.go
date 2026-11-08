package refactored

import (
	"testing"
	"time"
)

// REFACTOR: synchronizes on the real event (the Sent channel) instead of
// guessing how long it takes. The timeout is only a safety net in case
// something hangs; normally the test finishes in microseconds.
func TestSendAsync(t *testing.T) {
	m := &Mailer{Sent: make(chan string, 1)}
	m.SendAsync("ana@shop.test")
	select {
	case to := <-m.Sent:
		if to != "ana@shop.test" {
			t.Fatalf("sent to %q", to)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("timed out waiting for the mail to be sent")
	}
	if got := m.SentTo(); len(got) != 1 {
		t.Fatalf("sent = %v", got)
	}
}
