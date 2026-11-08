// Package smelly hides logic with side effects in init(): it reads the
// environment, silently picks defaults and fills global state on import.
package smelly

import (
	"os"
	"strconv"
)

// Config is the shop configuration.
type Config struct {
	Currency    string
	MaxCartSize int
}

// Current is the configuration loaded in init.
var Current Config

// SMELL: init() with side effects: it runs when the package is imported (in
// tests and tools too), reads environment variables, swallows the conversion
// error and leaves global state behind. It cannot be retried, tested with
// other values, or report the error to the caller.
func init() {
	Current.Currency = os.Getenv("SHOP_CURRENCY")
	if Current.Currency == "" {
		Current.Currency = "EUR"
	}
	n, err := strconv.Atoi(os.Getenv("SHOP_MAX_CART"))
	if err != nil {
		n = 50 // SMELL: a mistyped value is silently ignored
	}
	Current.MaxCartSize = n
}
