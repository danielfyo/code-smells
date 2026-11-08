// Package refactored removes the Clutter: the zero value works as an empty
// list, there is no commented-out code, no useless variables or
// conversions, and the flow uses early returns without else.
package refactored

import (
	"slices"
	"strings"
)

// ShoppingList is a shopping list; its zero value is ready to use.
// REFACTOR: Remove Dead Code (empty constructor removed).
type ShoppingList struct {
	items []string
}

// Add adds an item.
// REFACTOR: Guard Clause and noise removal.
func (l *ShoppingList) Add(item string) {
	item = strings.TrimSpace(item)
	if item == "" {
		return
	}
	l.items = append(l.items, strings.ToLower(item))
}

// Summary returns the sorted items.
func (l *ShoppingList) Summary() string {
	sorted := slices.Clone(l.items)
	slices.Sort(sorted)
	return strings.Join(sorted, ", ")
}
