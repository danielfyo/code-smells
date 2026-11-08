// Package refactored extracts the loop body into a function, so the defer
// runs at the end of each iteration.
package refactored

// TotalSize sums the size of all the files.
//
// REFACTOR: Extract Function; each file is opened and closed inside fileSize,
// and there is never more than one open.
func TotalSize(fs *FileSystem, names []string) (int, error) {
	total := 0
	for _, name := range names {
		size, err := fileSize(fs, name)
		if err != nil {
			return 0, err
		}
		total += size
	}
	return total, nil
}

func fileSize(fs *FileSystem, name string) (int, error) {
	f, err := fs.Open(name)
	if err != nil {
		return 0, err
	}
	defer f.Close()
	return f.Size(), nil
}
