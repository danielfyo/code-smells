// Package refactored fixes Alternative Classes with Different Interfaces by
// unifying both implementations behind a common Notifier interface, so the
// client treats them the same way and new channels can be added.
package refactored

import (
	"errors"
	"fmt"
)

// Message is the channel-independent notice.
type Message struct{ Subject, Body string }

// Notifier is the common interface.
// REFACTOR: Change Function Declaration (Rename Method) + Extract Interface.
type Notifier interface {
	Notify(m Message) error
}

// EmailNotifier sends emails.
type EmailNotifier struct {
	Address string
	Outbox  []string
}

// Notify sends the email.
func (e *EmailNotifier) Notify(m Message) error {
	if e.Address == "" {
		return errors.New("empty address")
	}
	e.Outbox = append(e.Outbox, fmt.Sprintf("email:%s:%s:%s", e.Address, m.Subject, m.Body))
	return nil
}

// SMSNotifier sends text messages.
// REFACTOR: same signature and explicit errors instead of bool.
type SMSNotifier struct {
	Phone string
	Sent  []string
}

// Notify sends the SMS (without subject).
func (s *SMSNotifier) Notify(m Message) error {
	if s.Phone == "" {
		return errors.New("sms failed")
	}
	s.Sent = append(s.Sent, fmt.Sprintf("sms:%s:%s", s.Phone, m.Body))
	return nil
}

// NotifyShipment notifies through every given channel.
func NotifyShipment(orderID string, channels ...Notifier) error {
	msg := Message{Subject: "Shipment", Body: "Order " + orderID + " shipped"}
	for _, c := range channels {
		if err := c.Notify(msg); err != nil {
			return err
		}
	}
	return nil
}
