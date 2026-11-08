// Package refactored holds the production code (reading a CSV price list); the
// smell lives in the test file.
package refactored

import (
	"encoding/csv"
	"fmt"
	"io"
	"strconv"
)

// ParsePrices reads "sku,cents" lines and returns a sku → price map.
func ParsePrices(r io.Reader) (map[string]int64, error) {
	rows, err := csv.NewReader(r).ReadAll()
	if err != nil {
		return nil, fmt.Errorf("parse prices: %w", err)
	}
	prices := make(map[string]int64, len(rows))
	for _, row := range rows {
		cents, err := strconv.ParseInt(row[1], 10, 64)
		if err != nil {
			return nil, fmt.Errorf("parse price for %s: %w", row[0], err)
		}
		prices[row[0]] = cents
	}
	return prices, nil
}
