package refactored

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
	if err := Migrate(mem, archive, []string{"missing"}); err == nil {
		t.Error("expected not found error")
	}
	// Migrate(archive, mem, ...) no longer compiles: ArchiveStorage is not a Writer.
	var r any = archive
	if _, ok := r.(Writer); ok {
		t.Error("archive must not implement Writer")
	}
}
