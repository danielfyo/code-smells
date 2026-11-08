package smelly

import "testing"

func TestReserveMessages(t *testing.T) {
	stock := map[string]int{"tea": 1}
	if err := Reserve(stock, "tea", 5); err == nil || err.Error() != "reserve tea: Not enough stock!." {
		t.Fatalf("err = %v", err)
	}
	if err := Reserve(stock, "milk", 1); err == nil || err.Error() != "Error: Product not found." {
		t.Fatalf("err = %v", err)
	}
}
