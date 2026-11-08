// Package refactored checks and propagates every error with context.
package refactored

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
)

// OrderLine is an imported order line.
type OrderLine struct {
	SKU string `json:"sku"`
	Qty int    `json:"qty"`
}

// ParseLine parses "sku:quantity".
//
// REFACTOR: every error is checked and returned wrapped with context.
func ParseLine(s string) (OrderLine, error) {
	sku, qtyText, ok := strings.Cut(s, ":")
	if !ok {
		return OrderLine{}, fmt.Errorf("parse line %q: missing ':'", s)
	}
	qty, err := strconv.Atoi(qtyText)
	if err != nil {
		return OrderLine{}, fmt.Errorf("parse line %q: %w", s, err)
	}
	return OrderLine{SKU: sku, Qty: qty}, nil
}

// Export writes the lines as JSON and returns any error.
func Export(w io.Writer, lines []OrderLine) error {
	data, err := json.Marshal(lines)
	if err != nil {
		return fmt.Errorf("export: marshal: %w", err)
	}
	if _, err := w.Write(data); err != nil {
		return fmt.Errorf("export: write: %w", err)
	}
	return nil
}
