// Package smelly illustrates Flag / Selector Arguments: the express boolean
// turns ShipOrder into two different functions packed into one. In the call
// ShipOrder(o, true) you cannot tell what true means.
package smelly

// Order is an order.
type Order struct {
	WeightKg float64
}

// Shipment is the result of shipping.
type Shipment struct {
	Cost float64
	Days int
}

// ShipOrder computes shipping.
// SMELL: Flag Argument. Each branch is a different function.
func ShipOrder(o Order, express bool) Shipment {
	if express {
		cost := 9.9 + o.WeightKg*1.5
		return Shipment{Cost: cost, Days: 1}
	}
	cost := 3.5 + o.WeightKg*0.5
	if cost > 10 {
		cost = 10
	}
	return Shipment{Cost: cost, Days: 4}
}
