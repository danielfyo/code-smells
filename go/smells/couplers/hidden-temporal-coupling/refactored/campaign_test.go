package refactored

import "testing"

func TestSend(t *testing.T) {
	c, err := NewCampaign("Hi {name}!", []string{"ana@x.io", "leo@x.io"})
	if err != nil {
		t.Fatal(err)
	}
	if got := c.Send(); len(got) != 2 || got[0] != "ana@x.io: Hi ana!" {
		t.Errorf("sent %v", got)
	}
	if _, err := NewCampaign("", []string{"ana@x.io"}); err == nil {
		t.Error("expected template error")
	}
	if _, err := NewCampaign("Hi", nil); err == nil {
		t.Error("expected recipients error")
	}
}
