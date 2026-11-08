// Package refactored makes the dependency physical: the formatter asks the
// printer for its width instead of assuming it.
package refactored

import "strings"

// LabelPrinter prints fixed-width shipping labels.
type LabelPrinter struct {
	width   int
	Printed []string
}

// NewLabelPrinter creates a printer with the given column width.
func NewLabelPrinter(width int) *LabelPrinter { return &LabelPrinter{width: width} }

// Width returns the printer's number of columns.
func (p *LabelPrinter) Width() int { return p.width }

// Print prints an already formatted label.
func (p *LabelPrinter) Print(label string) { p.Printed = append(p.Printed, label) }

// FormatLabel fits the address to the given width.
//
// REFACTOR: the width arrives as a parameter; callers get it from the printer
// itself, so replacing the printer cannot silently break anything.
func FormatLabel(address string, width int) string {
	if len(address) > width {
		address = address[:width]
	}
	return address + strings.Repeat(" ", width-len(address))
}

// PrintAddress formats and prints using the printer's real width.
func (p *LabelPrinter) PrintAddress(address string) { p.Print(FormatLabel(address, p.Width())) }
