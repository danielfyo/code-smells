package smelly

import (
	"reflect"
	"testing"
)

func TestLowStock(t *testing.T) {
	products := []Product{{"abc-1", 2}, {"abc-2", 10}, {"abc-3", 0}}
	got := LowStock(products, 5)
	want := []string{"ABC-1", "ABC-3"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("LowStock = %v, want %v", got, want)
	}
}
