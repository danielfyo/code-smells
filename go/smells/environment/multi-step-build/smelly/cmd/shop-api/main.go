// Command shop-api prints the build information; it is the binary built in
// this example.
package main

import (
	"fmt"

	"github.com/danielfyo/code-smells/go/smells/environment/multi-step-build/smelly"
)

func main() { fmt.Println(smelly.BuildInfo()) }
