// Package smelly shows a goroutine leak: several queries are launched, the
// first answer is used and the others stay blocked forever.
package smelly

// Supplier returns a price from a supplier.
type Supplier func() int64

// FirstQuote asks every supplier for a price and returns the first one to
// answer.
//
// SMELL: the channel is unbuffered and read only once. The remaining
// goroutines block on "results <- ..." and never finish: memory and resources
// that are not released while the process lives.
func FirstQuote(suppliers []Supplier) int64 {
	results := make(chan int64)
	for _, s := range suppliers {
		go func() {
			results <- s()
		}()
	}
	return <-results
}
