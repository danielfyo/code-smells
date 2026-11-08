// Package refactored fixes Message Chains by hiding the navigation: each
// type directly offers what its clients need and the calculation only talks
// to its immediate neighbor (Law of Demeter).
package refactored

// Country is a country.
type Country struct {
	Code    string
	TaxZone string
}

// Address is an address.
type Address struct{ country Country }

// TaxZone delegates to the country. REFACTOR: Hide Delegate.
func (a Address) TaxZone() string { return a.country.TaxZone }

// Customer is a customer.
type Customer struct{ address Address }

// TaxZone delegates to the address.
func (c Customer) TaxZone() string { return c.address.TaxZone() }

// Order is an order.
type Order struct {
	Net      float64
	customer Customer
}

// NewOrder builds the order.
func NewOrder(net float64, countryCode, zone string) Order {
	return Order{Net: net, customer: Customer{Address{Country{countryCode, zone}}}}
}

// TaxZone is all the calculation needs to know about the order.
func (o Order) TaxZone() string { return o.customer.TaxZone() }

var vatRates = map[string]float64{"EU": 0.21, "CANARY": 0.07}

// VATFor computes VAT talking only to Order.
func VATFor(o Order) float64 { return o.Net * vatRates[o.TaxZone()] }
