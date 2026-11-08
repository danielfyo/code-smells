// Package refactored fixes Swallowed Errors by propagating every error with
// context (line number) and leaving the catalog untouched unless the whole
// import is valid, so it never ends up inconsistent.
package refactored

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

// ErrBadLine reports a malformed line.
var ErrBadLine = errors.New("bad line")

// ImportPrices loads "sku=price" lines into the catalog atomically.
// REFACTOR: return the error (wrapped with %w and context) instead of
// swallowing it; all failures are aggregated with errors.Join.
func ImportPrices(catalog map[string]float64, data string) error {
	parsed := map[string]float64{}
	var errs []error
	for i, line := range strings.Split(strings.TrimSpace(data), "\n") {
		sku, raw, ok := strings.Cut(line, "=")
		if !ok {
			errs = append(errs, fmt.Errorf("line %d: %w: %q", i+1, ErrBadLine, line))
			continue
		}
		price, err := strconv.ParseFloat(raw, 64)
		if err != nil {
			errs = append(errs, fmt.Errorf("line %d: price for %s: %w", i+1, sku, err))
			continue
		}
		parsed[sku] = price
	}
	if err := errors.Join(errs...); err != nil {
		return err
	}
	for sku, p := range parsed {
		catalog[sku] = p
	}
	return nil
}
