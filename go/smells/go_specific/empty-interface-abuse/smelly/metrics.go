// Package smelly uses any where a concrete or generic type would give type
// safety: errors show up at run time instead of compile time.
package smelly

import "fmt"

// Sum SMELL: accepts anything and decides at run time with a type switch.
// Passing a string compiles fine and only fails when executed.
func Sum(values []any) (float64, error) {
	var total float64
	for _, v := range values {
		switch n := v.(type) {
		case int:
			total += float64(n)
		case int64:
			total += float64(n)
		case float64:
			total += n
		default:
			return 0, fmt.Errorf("unsupported type %T", v)
		}
	}
	return total, nil
}

// Settings SMELL: a map[string]any as a "dynamic struct"; every read needs a
// type assertion that may fail.
type Settings map[string]any

// MaxItems reads the max_items setting.
func (s Settings) MaxItems() int {
	n, _ := s["max_items"].(int)
	return n
}
