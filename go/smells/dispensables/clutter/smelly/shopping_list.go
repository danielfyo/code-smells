// Package smelly illustrates Clutter: an empty constructor, commented-out
// code, variables assigned only to be discarded, redundant conversions, an
// unnecessary else and a trailing return. Noise that adds nothing.
package smelly

import (
	"sort"
	"strings"
)

// ShoppingList is a shopping list.
type ShoppingList struct {
	items []string
}

// NewShoppingList is an empty constructor.
// SMELL: Clutter. The zero value already works.
func NewShoppingList() *ShoppingList {
	l := &ShoppingList{}
	// l.items = make([]string, 0) // just in case
	return l
}

// Add adds an item.
func (l *ShoppingList) Add(item string) {
	var trimmed string = string(strings.TrimSpace(item)) // SMELL: redundant type and conversion
	unused := len(trimmed)                               // SMELL: useless variable
	_ = unused
	if trimmed == "" {
		return
	} else { // SMELL: unnecessary else after return
		l.items = append(l.items, strings.ToLower(trimmed))
	}
	return // SMELL: redundant return
}

// Summary returns the sorted items.
func (l *ShoppingList) Summary() string {
	// fmt.Println("debug", l.items)
	var result string = ""
	sorted := make([]string, len(l.items))
	copy(sorted, l.items)
	sort.Strings(sorted)
	result = strings.Join(sorted, ", ")
	return result
}
