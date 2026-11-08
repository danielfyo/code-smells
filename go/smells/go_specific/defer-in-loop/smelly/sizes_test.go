package smelly

import "testing"

func TestTotalSizeKeepsAllFilesOpen(t *testing.T) {
	fs := &FileSystem{}
	names := []string{"a.csv", "bb.csv", "ccc.csv", "dddd.csv"}
	total, err := TotalSize(fs, names)
	if err != nil || total != 5+6+7+8 {
		t.Fatalf("total=%d err=%v", total, err)
	}
	// Documents the bug: all four were open at the same time.
	if fs.MaxOpen != len(names) {
		t.Fatalf("MaxOpen = %d, want %d", fs.MaxOpen, len(names))
	}
	if fs.OpenCount() != 0 {
		t.Fatal("files should be closed once the function returns")
	}
}
