// Package refactored relies on Go 1.22+ semantics (one variable per
// iteration): no defensive copies, no extra parameters and no loop variables
// declared outside the loop.
package refactored

import "sync"

// Reminder is a reminder for a customer.
type Reminder struct {
	Customer string
}

// BuildSenders creates one send function per customer.
//
// REFACTOR: "customer := customer" is gone; with go >= 1.22 in go.mod each
// iteration already has its own variable.
func BuildSenders(customers []string) []func() Reminder {
	senders := make([]func() Reminder, 0, len(customers))
	for _, customer := range customers {
		senders = append(senders, func() Reminder { return Reminder{Customer: customer} })
	}
	return senders
}

// SendAll launches one goroutine per customer and collects the reminders.
//
// REFACTOR: the goroutine uses c directly; the variable is declared in the
// for statement itself (never outside), which guarantees a copy per iteration.
func SendAll(customers []string) []string {
	var mu sync.Mutex
	var wg sync.WaitGroup
	var sent []string
	for _, c := range customers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			sent = append(sent, c)
			mu.Unlock()
		}()
	}
	wg.Wait()
	return sent
}
