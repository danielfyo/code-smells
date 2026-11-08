package refactored

import "testing"

func TestSubscriberList(t *testing.T) {
	var l SubscriberList
	if err := l.Add(" Ana@News.io "); err != nil {
		t.Fatal(err)
	}
	if err := l.Add("ana@news.io"); err == nil {
		t.Error("expected duplicate error")
	}
	if err := l.Add("not-an-email"); err == nil {
		t.Error("expected invalid error")
	}
	if l.Count() != 1 {
		t.Errorf("count = %d", l.Count())
	}
}
