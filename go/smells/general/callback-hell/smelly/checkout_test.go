package smelly

import "testing"

func TestCheckout(t *testing.T) {
	s := &Services{}
	var tracking string
	var gotErr error
	Checkout(s, "tea", 1000, func(tr string, err error) { tracking, gotErr = tr, err })
	if gotErr != nil || tracking != "TRK-1" || len(s.Log) != 3 {
		t.Fatalf("tracking=%q err=%v log=%v", tracking, gotErr, s.Log)
	}

	s = &Services{OutOfStock: true}
	Checkout(s, "tea", 1000, func(tr string, err error) { tracking, gotErr = tr, err })
	if gotErr == nil || len(s.Log) != 0 {
		t.Fatal("expected out of stock error and no side effects")
	}
}
