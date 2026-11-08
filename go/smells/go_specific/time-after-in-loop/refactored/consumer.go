// Package refactored reuses a single timer for the whole loop and resets it
// after each message.
package refactored

import "time"

// Drain consumes orders until idle passes without receiving any or the
// channel is closed.
//
// REFACTOR: a single time.NewTimer, stopped with defer and restarted with
// Reset after each message (with Go 1.23+ semantics Reset leaves no stale
// values in the channel). Equivalent alternative: context.WithTimeout.
func Drain(orders <-chan string, idle time.Duration) []string {
	timer := time.NewTimer(idle)
	defer timer.Stop()

	var got []string
	for {
		select {
		case o, ok := <-orders:
			if !ok {
				return got
			}
			got = append(got, o)
			timer.Reset(idle)
		case <-timer.C:
			return got
		}
	}
}
