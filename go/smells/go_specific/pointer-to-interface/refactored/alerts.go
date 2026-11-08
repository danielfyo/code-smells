// Package refactored passes interfaces by value: the interface already
// contains the pointer to the concrete implementation.
package refactored

// Notifier sends alerts.
type Notifier interface {
	Notify(msg string)
}

// EmailNotifier stores the alerts it has sent.
type EmailNotifier struct {
	Sent []string
}

// Notify implements Notifier (pointer receiver: it mutates Sent).
func (e *EmailNotifier) Notify(msg string) { e.Sent = append(e.Sent, msg) }

// AlertLowStock sends a low stock alert.
//
// REFACTOR: the parameter is Notifier, not *Notifier. Mutations happen
// through the *EmailNotifier stored inside the interface.
func AlertLowStock(n Notifier, sku string) {
	n.Notify("low stock: " + sku)
}
