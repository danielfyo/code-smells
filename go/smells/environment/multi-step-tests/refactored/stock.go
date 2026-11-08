// Package refactored is a minimal package (stock reservation) with unit and
// integration tests. The smell is in how they are run: see
// Makefile.
package refactored

// Reserve subtracts qty from stock if there is enough and returns the new stock.
func Reserve(stock, qty int) (int, bool) {
	if qty <= 0 || qty > stock {
		return stock, false
	}
	return stock - qty, true
}
