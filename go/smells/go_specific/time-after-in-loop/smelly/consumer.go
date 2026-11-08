// Package smelly creates a new timer with time.After on every iteration of a
// consumer loop.
package smelly

import "time"

// Drain consumes orders until idle passes without receiving any or the
// channel is closed.
//
// SMELL: time.After inside the loop creates a Timer (and its channel) per
// message. With thousands of messages per second that is constant garbage;
// before Go 1.23 those timers were not even released until they fired, and
// with an idle of minutes memory grew without bound.
func Drain(orders <-chan string, idle time.Duration) []string {
	var got []string
	for {
		select {
		case o, ok := <-orders:
			if !ok {
				return got
			}
			got = append(got, o)
		case <-time.After(idle):
			return got
		}
	}
}
