package smelly

import (
	"testing"
	"time"
)

func TestDiscount(t *testing.T) {
	now := time.Date(2026, 6, 1, 0, 0, 0, 0, time.UTC)
	valid := Coupon{Code: "SUMMER", Percent: 15, Expires: now.AddDate(0, 1, 0)}
	expired := Coupon{Code: "OLD1", Percent: 50, Expires: now.AddDate(0, -1, 0)}
	if got := Discount(valid, now, 200, "web"); got != 30 {
		t.Errorf("valid = %v", got)
	}
	if got := Discount(expired, now, 200, "app"); got != 0 {
		t.Errorf("expired = %v", got)
	}
	_ = formatLegacyCode // only so the example shows that nobody uses it
}
