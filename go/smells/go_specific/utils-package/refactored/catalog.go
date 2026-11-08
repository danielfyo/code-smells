// Package refactored splits the old "utils" into packages with domain names
// (money, slug). What had no users (IsEmail, Retry) is deleted or moved to
// the package that needs it.
package refactored

import (
	"github.com/danielfyo/code-smells/go/smells/go_specific/utils-package/refactored/money"
	"github.com/danielfyo/code-smells/go/smells/go_specific/utils-package/refactored/slug"
)

// ProductCard builds a product card for the web catalog.
func ProductCard(title string, cents int64) string {
	return "/p/" + slug.Make(title) + " | " + money.Format(cents)
}
