package smelly

import "testing"

func TestMigrateFromArchive(t *testing.T) {
	archive := NewArchiveStorage(map[string]string{"2024": "closed"})
	mem := NewMemoryStorage()
	if err := Migrate(mem, archive, []string{"2024"}); err != nil {
		t.Fatal(err)
	}
	if v, _ := mem.Read("2024"); v != "closed" {
		t.Errorf("got %q", v)
	}
}

// Documents the bug: it compiles, but blows up at runtime.
func TestMigrateIntoArchivePanics(t *testing.T) {
	defer func() {
		if recover() == nil {
			t.Error("expected panic: ArchiveStorage refuses Write")
		}
	}()
	mem := NewMemoryStorage()
	_ = mem.Write("k", "v")
	_ = Migrate(NewArchiveStorage(map[string]string{}), mem, []string{"k"})
}
