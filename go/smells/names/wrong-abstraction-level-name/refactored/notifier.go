// Package refactored names operations after the business concept (notify a
// shipment) and keeps the mechanism as an implementation detail.
package refactored

import "fmt"

// ShipmentNotifier tells the customer that their order has shipped.
//
// REFACTOR: Rename Method to the domain's abstraction level; the channel
// (email, SMS...) stays hidden behind the implementation.
type ShipmentNotifier interface {
	NotifyShipped(customer, orderID string)
}

// EmailNotifier is an email implementation of ShipmentNotifier.
type EmailNotifier struct {
	Outbox []string
}

// NotifyShipped records the shipment notice in the outbox.
func (n *EmailNotifier) NotifyShipped(customer, orderID string) {
	n.Outbox = append(n.Outbox, fmt.Sprintf("%s: order %s shipped", customer, orderID))
}

// SentCount returns how many notices have been sent.
func (n *EmailNotifier) SentCount() int { return len(n.Outbox) }
