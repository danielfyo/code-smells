// Package smelly illustrates Shotgun Surgery: the rule "21% VAT rounded to
// cents" is copied into the cart, the invoice and the quote. Changing the
// VAT rate or the rounding forces edits in many places.
package smelly

import "math"

// Cart is a shopping cart.
type Cart struct{ Items []float64 }

// Total including taxes.
// SMELL: Shotgun Surgery. Copy #1 of the tax rule.
func (c Cart) Total() float64 {
	net := 0.0
	for _, i := range c.Items {
		net += i
	}
	return math.Round(net*1.21*100) / 100
}

// Invoice is an invoice with shipping costs.
type Invoice struct {
	Net      float64
	Shipping float64
}

// Total including taxes.
// SMELL: copy #2, with the same 1.21 literal and the same rounding.
func (i Invoice) Total() float64 {
	return math.Round((i.Net+i.Shipping)*1.21*100) / 100
}

// Quote is a quote based on hours.
type Quote struct {
	Hours float64
	Rate  float64
}

// Total including taxes.
// SMELL: copy #3. If someone forgets one when VAT changes, amounts diverge.
func (q Quote) Total() float64 {
	return math.Round(q.Hours*q.Rate*1.21*100) / 100
}
