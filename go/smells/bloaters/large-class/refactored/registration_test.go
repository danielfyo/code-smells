package refactored

import "testing"

func TestRegistrationService(t *testing.T) {
	notifier := &SMTPNotifier{Host: "smtp.internal"}
	store := NewUserStore()
	svc := RegistrationService{Store: store, Policy: PasswordPolicy{MinLength: 8}, Notifier: notifier}
	if err := svc.Register("bob@x.io", "secret123"); err != nil {
		t.Fatal(err)
	}
	if err := svc.Register("ana@x.io", "password9"); err != nil {
		t.Fatal(err)
	}
	for _, bad := range [][2]string{{"no-at", "secret123"}, {"bob@x.io", "secret123"}, {"eve@x.io", "short1"}, {"eve@x.io", "nodigitsatall"}} {
		if err := svc.Register(bad[0], bad[1]); err == nil {
			t.Errorf("expected error for %v", bad)
		}
	}
	if got := UserReport("Users", store); got != "Users: ana@x.io, bob@x.io" {
		t.Errorf("report = %q", got)
	}
	if n := len(notifier.Sent); n != 2 || notifier.Sent[0] != "[smtp.internal] bob@x.io: Welcome!" {
		t.Errorf("emails = %v", notifier.Sent)
	}
}

func TestPasswordPolicy(t *testing.T) {
	p := PasswordPolicy{MinLength: 6}
	cases := map[string]bool{"abc123": true, "abcdef": false, "a1": false}
	for pw, want := range cases {
		if got := p.IsStrong(pw); got != want {
			t.Errorf("IsStrong(%q) = %v, want %v", pw, got, want)
		}
	}
}
