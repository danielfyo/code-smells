// Package smelly holds the production code (sending emails in the background);
// the smell lives in the test file.
package smelly

import "sync"

// Mailer sends emails asynchronously.
type Mailer struct {
	mu   sync.Mutex
	sent []string
	// Sent, if not nil, receives each email after sending it (observation hook).
	Sent chan string
}

// SendAsync sends the email in a goroutine.
func (m *Mailer) SendAsync(to string) {
	go func() {
		m.mu.Lock()
		m.sent = append(m.sent, to)
		m.mu.Unlock()
		if m.Sent != nil {
			m.Sent <- to
		}
	}()
}

// SentTo returns a copy of the recipients sent so far.
func (m *Mailer) SentTo() []string {
	m.mu.Lock()
	defer m.mu.Unlock()
	return append([]string(nil), m.sent...)
}
