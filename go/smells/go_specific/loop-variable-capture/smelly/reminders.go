// Package smelly illustrates loop variable capture. Before Go 1.22 all
// iterations shared a single variable, so closures and goroutines saw the
// last value. Since Go 1.22 (this module uses go 1.24) each iteration has its
// own variable, but the problem is still alive when the variable is declared
// outside the loop, and the old "v := v" patch has been left behind as
// noise.
package smelly

import "sync"

// Reminder is a reminder for a customer.
type Reminder struct {
	Customer string
}

// BuildSenders creates one send function per customer.
//
// SMELL (historical): the "customer := customer" copy was mandatory before
// Go 1.22; with go 1.24 in go.mod it is noise that confuses readers.
func BuildSenders(customers []string) []func() Reminder {
	var senders []func() Reminder
	for _, customer := range customers {
		customer := customer // SMELL: pre-1.22 patch that is no longer needed
		senders = append(senders, func() Reminder { return Reminder{Customer: customer} })
	}
	return senders
}

// BuildSendersShared SMELL: reproduces the classic bug today. The variable is
// declared outside the loop (a single one for all iterations), so every
// closure captures the same one and returns the last customer.
func BuildSendersShared(customers []string) []func() Reminder {
	var senders []func() Reminder
	var customer string
	for _, customer = range customers {
		senders = append(senders, func() Reminder { return Reminder{Customer: customer} })
	}
	return senders
}

// SendAll launches one goroutine per customer and collects the reminders.
//
// SMELL (historical): again the extra parameter "go func(c string){...}(c)"
// that before 1.22 kept every goroutine from reading the same value.
func SendAll(customers []string) []string {
	var mu sync.Mutex
	var wg sync.WaitGroup
	var sent []string
	for _, c := range customers {
		wg.Add(1)
		go func(c string) {
			defer wg.Done()
			mu.Lock()
			sent = append(sent, c)
			mu.Unlock()
		}(c)
	}
	wg.Wait()
	return sent
}
