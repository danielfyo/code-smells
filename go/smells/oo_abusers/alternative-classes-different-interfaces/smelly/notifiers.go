// Package smelly illustrates Alternative Classes with Different Interfaces:
// two types that do the same job (notifying a customer) expose different
// names, signatures and ways of reporting errors, so they are not
// interchangeable and the client has to tell them apart by hand.
package smelly

import (
	"errors"
	"fmt"
)

// EmailSender sends emails.
type EmailSender struct{ Outbox []string }

// SendEmail reports failure with an error.
func (e *EmailSender) SendEmail(address, subject, body string) error {
	if address == "" {
		return errors.New("empty address")
	}
	e.Outbox = append(e.Outbox, fmt.Sprintf("email:%s:%s:%s", address, subject, body))
	return nil
}

// SMS is the gateway message.
type SMS struct{ Phone, Text string }

// SMSGateway sends text messages.
// SMELL: same responsibility, different method name, different
// parameter type and a different way of reporting errors (bool).
type SMSGateway struct{ Sent []string }

// Deliver returns false on failure.
func (g *SMSGateway) Deliver(m SMS) bool {
	if m.Phone == "" {
		return false
	}
	g.Sent = append(g.Sent, fmt.Sprintf("sms:%s:%s", m.Phone, m.Text))
	return true
}

// NotifyShipment notifies through every channel.
// SMELL: the client must know and adapt each API separately.
func NotifyShipment(email *EmailSender, sms *SMSGateway, address, phone, orderID string) error {
	text := "Order " + orderID + " shipped"
	if err := email.SendEmail(address, "Shipment", text); err != nil {
		return err
	}
	if !sms.Deliver(SMS{Phone: phone, Text: text}) {
		return errors.New("sms failed")
	}
	return nil
}
