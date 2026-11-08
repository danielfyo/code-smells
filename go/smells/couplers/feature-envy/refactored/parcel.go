// Package refactored fixes Feature Envy by moving the logic that envied
// Parcel's data into Parcel itself; the calculator only contributes its rate.
package refactored

const (
	volumetricDivisor = 5000
	fragileSurcharge  = 3
)

// Parcel is a package that knows how to compute its own metrics.
type Parcel struct {
	LengthCm, WidthCm, HeightCm float64
	WeightKg                    float64
	Fragile                     bool
}

// VolumetricWeight computes the volumetric weight.
// REFACTOR: Move Function (the logic travels to the data it uses).
func (p Parcel) VolumetricWeight() float64 {
	return p.LengthCm * p.WidthCm * p.HeightCm / volumetricDivisor
}

// BillableWeight is the larger of real and volumetric weight.
func (p Parcel) BillableWeight() float64 { return max(p.WeightKg, p.VolumetricWeight()) }

// Surcharge returns the parcel's own surcharges.
func (p Parcel) Surcharge() float64 {
	if p.Fragile {
		return fragileSurcharge
	}
	return 0
}

// ShippingCalculator computes shipping costs.
type ShippingCalculator struct {
	RatePerKg float64
}

// Cost combines its own rate with what the parcel knows about itself.
func (s ShippingCalculator) Cost(p Parcel) float64 {
	return p.BillableWeight()*s.RatePerKg + p.Surcharge()
}
