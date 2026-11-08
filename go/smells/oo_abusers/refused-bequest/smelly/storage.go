// Package smelly illustrates Refused Bequest adapted to Go: ArchiveStorage
// embeds MemoryStorage to reuse Read, but thereby also inherits Write and
// Delete, which it refuses with panic("not supported"). It satisfies the
// Storage interface and violates the Liskov substitution principle.
package smelly

import "fmt"

// Storage is an overly broad interface.
type Storage interface {
	Read(key string) (string, error)
	Write(key, value string) error
	Delete(key string) error
}

// MemoryStorage implements the whole contract.
type MemoryStorage struct{ data map[string]string }

// NewMemoryStorage creates an in-memory store.
func NewMemoryStorage() *MemoryStorage { return &MemoryStorage{data: map[string]string{}} }

// Read reads a key.
func (m *MemoryStorage) Read(key string) (string, error) {
	v, ok := m.data[key]
	if !ok {
		return "", fmt.Errorf("key %q not found", key)
	}
	return v, nil
}

// Write stores a key.
func (m *MemoryStorage) Write(key, value string) error { m.data[key] = value; return nil }

// Delete removes a key.
func (m *MemoryStorage) Delete(key string) error { delete(m.data, key); return nil }

// ArchiveStorage is a read-only archive.
// SMELL: Refused Bequest. It embeds MemoryStorage to "inherit" Read, but
// also inherits Write/Delete and refuses them at runtime.
type ArchiveStorage struct{ *MemoryStorage }

// NewArchiveStorage creates an archive with fixed data.
func NewArchiveStorage(data map[string]string) ArchiveStorage {
	return ArchiveStorage{&MemoryStorage{data: data}}
}

// Write refuses the bequest. SMELL: panic instead of not offering the method.
func (ArchiveStorage) Write(string, string) error { panic("not supported") }

// Delete refuses the bequest.
func (ArchiveStorage) Delete(string) error { panic("not supported") }

// Migrate copies keys from one Storage to another.
// SMELL: the client believes any Storage is a valid destination.
func Migrate(dst Storage, src Storage, keys []string) error {
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
