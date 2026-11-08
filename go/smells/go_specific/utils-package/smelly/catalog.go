// Package smelly depends on a "utils" package with no cohesion. Calling code
// reads utils.Slugify, utils.FormatMoney: the prefix adds nothing.
package smelly

import "github.com/danielfyo/code-smells/go/smells/go_specific/utils-package/smelly/utils"

// ProductCard builds a product card for the web catalog.
func ProductCard(title string, cents int64) string {
	// SMELL: utils.X does not say which domain X belongs to.
	return "/p/" + utils.Slugify(title) + " | " + utils.FormatMoney(cents)
}
