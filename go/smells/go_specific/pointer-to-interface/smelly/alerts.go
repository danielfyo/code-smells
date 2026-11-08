// Package smelly uses pointers to interfaces (*Notifier), which is almost
// never needed and reveals a misunderstanding of how interfaces work in Go.
package smelly

// Notifier sends alerts.
type Notifier interface {
	Notify(msg string)
}

// EmailNotifier stores the alerts it has sent.
type EmailNotifier struct {
	Sent []string
}

// Notify implements Notifier.
func (e *EmailNotifier) Notify(msg string) { e.Sent = append(e.Sent, msg) }

// AlertLowStock SMELL: receives *Notifier. An interface already holds a
// reference to its concrete value; the extra pointer forces callers to write
// &n and the callee to dereference (*n).Notify, and allows a nil *Notifier.
func AlertLowStock(n *Notifier, sku string) {
	(*n).Notify("low stock: " + sku)
}
