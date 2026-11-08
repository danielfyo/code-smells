// Package refactored fixes Flag Arguments by splitting the function into two
// with their own names: the intent is explicit at every call site.
package refactored

// Order is an order.
type Order struct {
	WeightKg float64
}

// Shipment is the result of shipping.
type Shipment struct {
	Cost float64
	Days int
}

// ShipStandard computes standard shipping.
// REFACTOR: Remove Flag Argument (Split Function).
func ShipStandard(o Order) Shipment {
	return Shipment{Cost: min(3.5+o.WeightKg*0.5, 10), Days: 4}
}

// ShipExpress computes express shipping.
func ShipExpress(o Order) Shipment {
	return Shipment{Cost: 9.9 + o.WeightKg*1.5, Days: 1}
}
