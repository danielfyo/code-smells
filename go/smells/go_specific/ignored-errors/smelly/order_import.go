// Package smelly discards errors with _ or does not check them: failures go
// unnoticed and data is silently corrupted.
package smelly

import (
	"encoding/json"
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
// SMELL: the Atoi error is discarded with _. "tea:ten" becomes a line with
// quantity 0 instead of being rejected.
func ParseLine(s string) OrderLine {
	sku, qtyText, _ := strings.Cut(s, ":")
	qty, _ := strconv.Atoi(qtyText)
	return OrderLine{SKU: sku, Qty: qty}
}

// Export writes the lines as JSON.
//
// SMELL: neither Marshal nor Write is checked. If the writer fails (disk
// full, connection closed) the caller believes everything went well.
func Export(w io.Writer, lines []OrderLine) {
	data, _ := json.Marshal(lines)
	w.Write(data)
}
