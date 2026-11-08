// Package smelly illustrates Message Chains (Train Wreck): to find the tax
// zone of an order, the client navigates order → customer → address →
// country → zone. Any change in that structure breaks every client.
package smelly

// Country is a country.
type Country struct {
	Code    string
	taxZone string
}

// TaxZone returns the tax zone.
func (c *Country) TaxZone() string { return c.taxZone }

// Address is an address.
type Address struct{ country *Country }

// Country returns the country.
func (a *Address) Country() *Country { return a.country }

// Customer is a customer.
type Customer struct{ address *Address }

// Address returns the address.
func (c *Customer) Address() *Address { return c.address }

// Order is an order.
type Order struct {
	Net      float64
	customer *Customer
}

// Customer returns the customer.
func (o *Order) Customer() *Customer { return o.customer }

// NewOrder builds the whole object graph.
func NewOrder(net float64, countryCode, zone string) *Order {
	return &Order{Net: net, customer: &Customer{address: &Address{country: &Country{countryCode, zone}}}}
}

// VATFor computes the VAT of an order.
// SMELL: Message Chains. The calculation depends on four intermediate types.
func VATFor(o *Order) float64 {
	switch o.Customer().Address().Country().TaxZone() {
	case "EU":
		return o.Net * 0.21
	case "CANARY":
		return o.Net * 0.07
	default:
		return 0
	}
}
