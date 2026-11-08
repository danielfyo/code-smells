// Package refactored removes the Overridden Safeties: TLS verification keeps
// its secure default (a custom CA pool is the right fix for a private
// certificate), write errors are handled, and no test is skipped.
package refactored

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io"
	"net/http"
	"time"
)

// NewClient builds the HTTP client used to upload reports.
// REFACTOR: fix the root cause instead of disabling the check: trust an
// extra CA pool when needed and keep verification on.
func NewClient(extraCAs *x509.CertPool) *http.Client {
	return &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{RootCAs: extraCAs, MinVersion: tls.VersionTLS12},
		},
	}
}

// WriteReport writes the report body and reports the first failure.
// REFACTOR: handle the error the linter was warning about.
func WriteReport(w io.Writer, lines []string) error {
	for i, l := range lines {
		if _, err := io.WriteString(w, l+"\n"); err != nil {
			return fmt.Errorf("write line %d: %w", i+1, err)
		}
	}
	return nil
}
