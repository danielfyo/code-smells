package smelly

import "testing"

func TestUserManager(t *testing.T) {
	m := NewUserManager()
	if err := m.Register("bob@x.io", "secret123"); err != nil {
		t.Fatal(err)
	}
	if err := m.Register("ana@x.io", "password9"); err != nil {
		t.Fatal(err)
	}
	for _, bad := range [][2]string{{"no-at", "secret123"}, {"bob@x.io", "secret123"}, {"eve@x.io", "short1"}, {"eve@x.io", "nodigitsatall"}} {
		if err := m.Register(bad[0], bad[1]); err == nil {
			t.Errorf("expected error for %v", bad)
		}
	}
	if got := m.Report(); got != "Users: ana@x.io, bob@x.io" {
		t.Errorf("report = %q", got)
	}
	if n := len(m.SentEmails()); n != 2 || m.SentEmails()[0] != "[smtp.internal] bob@x.io: Welcome!" {
		t.Errorf("emails = %v", m.SentEmails())
	}
}
