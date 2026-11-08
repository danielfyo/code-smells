// Package refactored loads configuration with an explicit function that
// receives its dependencies and returns an error; nothing happens on import.
package refactored

import (
	"fmt"
	"strconv"
)

// Config is the shop configuration.
type Config struct {
	Currency    string
	MaxCartSize int
}

// Load builds the configuration from a lookup function (os.Getenv in
// production, a map in tests).
//
// REFACTOR: Replace init() with explicit constructor. The caller (main)
// decides when to load, can inject the environment and receives the errors.
func Load(getenv func(string) string) (Config, error) {
	cfg := Config{Currency: "EUR", MaxCartSize: 50}
	if c := getenv("SHOP_CURRENCY"); c != "" {
		cfg.Currency = c
	}
	if raw := getenv("SHOP_MAX_CART"); raw != "" {
		n, err := strconv.Atoi(raw)
		if err != nil {
			return Config{}, fmt.Errorf("load config: SHOP_MAX_CART: %w", err)
		}
		cfg.MaxCartSize = n
	}
	return cfg, nil
}
