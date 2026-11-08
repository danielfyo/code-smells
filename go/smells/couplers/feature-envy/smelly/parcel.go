// Package smelly illustrates Feature Envy: the ShippingCalculator method uses
// almost exclusively Parcel's data (dimensions, weight, fragility) and
// barely its own. The logic is in the wrong place.
package smelly

// Parcel is a package.
type Parcel struct {
	LengthCm, WidthCm, HeightCm float64
	WeightKg                    float64
	Fragile                     bool
}

// ShippingCalculator computes shipping costs.
type ShippingCalculator struct {
	RatePerKg float64
}

// Cost computes the shipping cost.
// SMELL: Feature Envy. Six accesses to Parcel fields versus one of its own.
func (s ShippingCalculator) Cost(p Parcel) float64 {
	volumetric := p.LengthCm * p.WidthCm * p.HeightCm / 5000
	billable := p.WeightKg
	if volumetric > billable {
		billable = volumetric
	}
	cost := billable * s.RatePerKg
	if p.Fragile {
		cost += 3
	}
	return cost
}
