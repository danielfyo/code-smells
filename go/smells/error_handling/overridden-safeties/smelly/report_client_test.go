package smelly

import (
	"bytes"
	"errors"
	"net/http"
	"testing"
)

type failingWriter struct{}

func (failingWriter) Write([]byte) (int, error) { return 0, errors.New("disk full") }

func TestWriteReport(t *testing.T) {
	var b bytes.Buffer
	if err := WriteReport(&b, []string{"a", "b"}); err != nil || b.String() != "a\nb\n" {
		t.Errorf("got %q, %v", b.String(), err)
	}
}

// Documents the bug: the silenced error turns a failure into success.
func TestFailedWriteLooksSuccessful(t *testing.T) {
	if err := WriteReport(failingWriter{}, []string{"a"}); err != nil {
		t.Errorf("err = %v; the smelly version hides it", err)
	}
}

// Documents the disabled safety.
func TestTLSVerificationIsDisabled(t *testing.T) {
	tr := NewClient().Transport.(*http.Transport)
	if !tr.TLSClientConfig.InsecureSkipVerify {
		t.Error("expected certificate verification to be disabled")
	}
}

// SMELL: a failing test is skipped instead of being fixed.
func TestUploadRetries(t *testing.T) {
	t.Skip("flaky, fix later")
}
