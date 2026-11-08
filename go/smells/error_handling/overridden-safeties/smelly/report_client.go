// Package smelly illustrates Overridden Safeties: TLS certificate checks are
// switched off "temporarily", a lint warning is silenced with //nolint
// instead of being fixed, and a failing test is skipped so the build stays
// green. Every safety net is still there, just disabled.
package smelly

import (
	"crypto/tls"
	"io"
	"net/http"
	"time"
)

// NewClient builds the HTTP client used to upload reports.
// SMELL: Overridden Safeties. Certificate verification is disabled to get
// past a staging certificate problem and never re-enabled.
func NewClient() *http.Client {
	return &http.Client{
		Timeout: 10 * time.Second,
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, //nolint:gosec // TODO: remove
		},
	}
}

// WriteReport writes the report body.
// SMELL: the errcheck warning is silenced instead of handling the error,
// so a failed write is reported as success.
func WriteReport(w io.Writer, lines []string) error {
	for _, l := range lines {
		w.Write([]byte(l + "\n")) //nolint:errcheck
	}
	return nil
}
