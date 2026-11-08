// Package smelly uses panic/recover for expected errors (invalid input) as if
// they were exceptions.
package smelly

import (
	"fmt"
	"strconv"
)

// mustParseAge SMELL: invalid user input is not a programming error, yet here
// it triggers a panic.
func mustParseAge(s string) int {
	age, err := strconv.Atoi(s)
	if err != nil || age < 0 || age > 150 {
		panic(fmt.Sprintf("invalid age %q", s))
	}
	return age
}

// RegisterAge SMELL: recover used as try/catch. The normal error flow is
// hidden, it is expensive, and any other panic (a real bug) would also be
// swallowed here as "invalid age".
func RegisterAge(s string) (age int, ok bool) {
	defer func() {
		if r := recover(); r != nil {
			age, ok = 0, false
		}
	}()
	return mustParseAge(s), true
}
