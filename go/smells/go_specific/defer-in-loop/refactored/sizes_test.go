package refactored

import "testing"

func TestTotalSizeOpensOneFileAtATime(t *testing.T) {
	fs := &FileSystem{}
	names := []string{"a.csv", "bb.csv", "ccc.csv", "dddd.csv"}
	total, err := TotalSize(fs, names)
	if err != nil || total != 5+6+7+8 {
		t.Fatalf("total=%d err=%v", total, err)
	}
	if fs.MaxOpen != 1 {
		t.Fatalf("MaxOpen = %d, want 1", fs.MaxOpen)
	}
	if fs.OpenCount() != 0 {
		t.Fatal("all files should be closed")
	}
}
