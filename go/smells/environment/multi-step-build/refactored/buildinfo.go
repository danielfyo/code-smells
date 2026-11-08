// Package refactored is a minimal package exposing build information
// (version injected with -ldflags). The smell is in how it is built: see
// Makefile.
package refactored

// Version is overridden at build time with
// -ldflags "-X <package>.Version=1.2.3"; it defaults to "dev".
var Version = "dev"

// BuildInfo returns a readable string with the version.
func BuildInfo() string { return "shop-api " + Version }
