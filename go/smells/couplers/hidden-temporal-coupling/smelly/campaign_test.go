package smelly

import "testing"

func TestSend(t *testing.T) {
	var m Mailer
	m.SetTemplate("Hi {name}!")
	m.SetRecipients([]string{"ana@x.io", "leo@x.io"})
	if n := m.Send(); n != 2 || m.Sent[0] != "ana@x.io: Hi ana!" {
		t.Errorf("sent %d %v", n, m.Sent)
	}
}

// Documents the bug: with the wrong order, empty emails are sent.
func TestWrongOrderSendsEmptyEmails(t *testing.T) {
	var m Mailer
	m.SetRecipients([]string{"ana@x.io"})
	m.Send()
	m.SetTemplate("Hi {name}!")
	if m.Sent[0] != "ana@x.io: " {
		t.Errorf("got %q", m.Sent[0])
	}
}
