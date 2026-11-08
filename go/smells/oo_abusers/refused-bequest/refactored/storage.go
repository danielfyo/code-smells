// Package refactored fixes Refused Bequest by segregating interfaces: the
// archive only implements Reader, and the compiler prevents using it where
// writing is required.
package refactored

import "fmt"

// Reader is the read capability.
// REFACTOR: Interface Segregation / Replace Inheritance with Delegation.
type Reader interface {
	Read(key string) (string, error)
}

// Writer is the write capability.
type Writer interface {
	Write(key, value string) error
	Delete(key string) error
}

// ReadWriter composes both.
type ReadWriter interface {
	Reader
	Writer
}

type mapReader map[string]string

func (m mapReader) Read(key string) (string, error) {
	v, ok := m[key]
	if !ok {
		return "", fmt.Errorf("key %q not found", key)
	}
	return v, nil
}

// MemoryStorage implements ReadWriter.
type MemoryStorage struct{ mapReader }

// NewMemoryStorage creates an in-memory store.
func NewMemoryStorage() *MemoryStorage { return &MemoryStorage{mapReader{}} }

// Write stores a key.
func (m *MemoryStorage) Write(key, value string) error { m.mapReader[key] = value; return nil }

// Delete removes a key.
func (m *MemoryStorage) Delete(key string) error { delete(m.mapReader, key); return nil }

// ArchiveStorage offers reading only.
// REFACTOR: shares reading through composition without inheriting what it refuses.
type ArchiveStorage struct{ mapReader }

// NewArchiveStorage creates an archive with fixed data.
func NewArchiveStorage(data map[string]string) ArchiveStorage { return ArchiveStorage{data} }

// Migrate requires a Writer as destination: passing ArchiveStorage does not compile.
func Migrate(dst Writer, src Reader, keys []string) error {
	for _, k := range keys {
		v, err := src.Read(k)
		if err != nil {
			return err
		}
		if err := dst.Write(k, v); err != nil {
			return err
		}
	}
	return nil
}

var (
	_ ReadWriter = (*MemoryStorage)(nil)
	_ Reader     = ArchiveStorage{}
)
