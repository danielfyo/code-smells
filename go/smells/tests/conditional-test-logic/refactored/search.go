// Package refactored holds the production code (product search by tag); the
// smell lives in the test file.
package refactored

// Product is a catalog item.
type Product struct {
	Name string
	Tags []string
}

// ByTag returns the products carrying the given tag.
func ByTag(products []Product, tag string) []Product {
	var out []Product
	for _, p := range products {
		for _, t := range p.Tags {
			if t == tag {
				out = append(out, p)
				break
			}
		}
	}
	return out
}
