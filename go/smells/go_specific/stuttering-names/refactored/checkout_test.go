package refactored

import (
	"testing"

	"github.com/danielfyo/code-smells/go/smells/go_specific/stuttering-names/refactored/order"
)

func TestCheckout(t *testing.T) {
	if got := Checkout("A1"); got != order.Paid {
		t.Fatalf("status = %q", got)
	}
}
