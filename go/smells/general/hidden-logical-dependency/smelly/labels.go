// Package smelly shows a logical dependency not made physical: the formatter
// assumes a label width that only the printer "knows".
package smelly

import "strings"

// LabelPrinter prints fixed-width shipping labels.
type LabelPrinter struct {
	Printed []string
}

// Print prints an already formatted label.
func (p *LabelPrinter) Print(label string) { p.Printed = append(p.Printed, label) }

// FormatLabel prepares the label text.
//
// SMELL: the 20 is here because "the printer has 20 columns". If the printer
// changes, nobody will know this number must change too: the dependency
// exists but is not expressed in the code.
func FormatLabel(address string) string {
	if len(address) > 20 {
		address = address[:20]
	}
	return address + strings.Repeat(" ", 20-len(address))
}
