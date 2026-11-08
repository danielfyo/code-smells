package smelly

import (
	"testing"
	"time"
)

// SMELL: "waits" with an arbitrary sleep. On a loaded machine (CI) 100 ms may
// not be enough and the test fails intermittently; on a fast one almost all
// of it is wasted.
func TestSendAsync(t *testing.T) {
	m := &Mailer{}
	m.SendAsync("ana@shop.test")
	time.Sleep(100 * time.Millisecond)
	if got := m.SentTo(); len(got) != 1 || got[0] != "ana@shop.test" {
		t.Fatalf("sent = %v", got)
	}
}
