// Package smelly chains nested callbacks ("continuation passing" style) for
// the purchase process: the pyramid of doom.
package smelly

import "errors"

// Services simulates the asynchronous checkout operations.
type Services struct {
	OutOfStock bool
	Log        []string
}

// Reserve reserves stock and calls cb with the result.
func (s *Services) Reserve(sku string, cb func(err error)) {
	if s.OutOfStock {
		cb(errors.New("out of stock"))
		return
	}
	s.Log = append(s.Log, "reserved "+sku)
	cb(nil)
}

// Charge charges and calls cb with the payment id.
func (s *Services) Charge(cents int64, cb func(paymentID string, err error)) {
	s.Log = append(s.Log, "charged")
	cb("pay-1", nil)
}

// Ship creates the shipment and calls cb with the tracking number.
func (s *Services) Ship(paymentID string, cb func(tracking string, err error)) {
	s.Log = append(s.Log, "shipped "+paymentID)
	cb("TRK-1", nil)
}

// Checkout SMELL: each step is nested inside the previous one; error handling
// is repeated at every level and the flow reads diagonally.
func Checkout(s *Services, sku string, cents int64, done func(tracking string, err error)) {
	s.Reserve(sku, func(err error) {
		if err != nil {
			done("", err)
			return
		}
		s.Charge(cents, func(paymentID string, err error) {
			if err != nil {
				done("", err)
				return
			}
			s.Ship(paymentID, func(tracking string, err error) {
				if err != nil {
					done("", err)
					return
				}
				done(tracking, nil)
			})
		})
	})
}
