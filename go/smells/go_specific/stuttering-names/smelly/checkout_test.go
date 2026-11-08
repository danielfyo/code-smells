package smelly

import (
	"testing"

	"github.com/danielfyo/code-smells/go/smells/go_specific/stuttering-names/smelly/order"
)

func TestCheckout(t *testing.T) {
	if got := Checkout("A1"); got != order.OrderStatusPaid {
		t.Fatalf("status = %q", got)
	}
}
