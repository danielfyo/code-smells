# How to build shop-api (read all of it, seriously)

> SMELL: building requires a manual sequence of steps and tribal knowledge.
> Everyone does it slightly differently, the steps go stale and CI ends up
> with its own version of this document.

1. Make sure you have Go 1.24 (ask Marta if the proxy gives you trouble).
2. Export the variables:
   ```
   export CGO_ENABLED=0
   export GOFLAGS=-mod=mod
   ```
3. Generate the code (if you forget, it still builds but with stale data):
   ```
   go generate ./...
   ```
4. Copy `config.example.yaml` to `config.yaml` and change the port to 8081.
5. Find the version with `git describe --tags` and paste it by hand into:
   ```
   go build -ldflags "-X github.com/danielfyo/code-smells/go/smells/environment/multi-step-build/smelly.Version=<VERSION>" -o bin/shop-api ./cmd/shop-api
   ```
6. Run `go vet ./...` (optional, but if you skip it CI complains).
7. If step 5 fails, delete `bin/` and go back to step 3.
