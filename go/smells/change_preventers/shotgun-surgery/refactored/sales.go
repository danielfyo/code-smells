// Package refactored fixes Shotgun Surgery by concentrating the tax rule in
// a single place: a change of VAT rate or rounding is made only once.
package refactored

import "math"

// VATRate is the standard VAT rate.
// REFACTOR: Replace Magic Number with Symbolic Constant.
const VATRate = 0.21

// WithVAT applies VAT and rounds to cents.
// REFACTOR: Move Function / Combine Functions into Transform: the rule
// that used to be scattered now lives in a single place.
func WithVAT(net float64) float64 {
	return math.Round(net*(1+VATRate)*100) / 100
}

// Cart is a shopping cart.
type Cart struct{ Items []float64 }

// Total including taxes.
func (c Cart) Total() float64 {
	net := 0.0
	for _, i := range c.Items {
		net += i
	}
	return WithVAT(net)
}

// Invoice is an invoice with shipping costs.
type Invoice struct {
	Net      float64
	Shipping float64
}

// Total including taxes.
func (i Invoice) Total() float64 { return WithVAT(i.Net + i.Shipping) }

// Quote is a quote based on hours.
type Quote struct {
	Hours float64
	Rate  float64
}

// Total including taxes.
func (q Quote) Total() float64 { return WithVAT(q.Hours * q.Rate) }
