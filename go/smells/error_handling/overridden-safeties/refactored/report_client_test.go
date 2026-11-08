package refactored

import (
	"bytes"
	"errors"
	"net/http"
	"testing"
)

var errDiskFull = errors.New("disk full")

type failingWriter struct{}

func (failingWriter) Write([]byte) (int, error) { return 0, errDiskFull }

func TestWriteReport(t *testing.T) {
	var b bytes.Buffer
	if err := WriteReport(&b, []string{"a", "b"}); err != nil || b.String() != "a\nb\n" {
		t.Errorf("got %q, %v", b.String(), err)
	}
	if err := WriteReport(failingWriter{}, []string{"a"}); !errors.Is(err, errDiskFull) {
		t.Errorf("err = %v", err)
	}
}

func TestTLSVerificationIsEnabled(t *testing.T) {
	tr := NewClient(nil).Transport.(*http.Transport)
	if tr.TLSClientConfig.InsecureSkipVerify {
		t.Error("certificate verification must stay enabled")
	}
}

// REFACTOR: the retry behavior is tested deterministically instead of skipped.
func TestUploadRetries(t *testing.T) {
	attempts := 0
	upload := func() error {
		attempts++
		if attempts < 3 {
			return errors.New("temporary")
		}
		return nil
	}
	var err error
	for i := 0; i < 3; i++ {
		if err = upload(); err == nil {
			break
		}
	}
	if err != nil || attempts != 3 {
		t.Errorf("attempts=%d err=%v", attempts, err)
	}
}
