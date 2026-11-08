// Package smelly uses defer inside a loop: the Close calls do not run at the
// end of each iteration but when the function returns, so every file stays
// open at the same time.
package smelly

// TotalSize sums the size of all the files.
//
// SMELL: defer in the loop. With 10,000 files there would be 10,000
// descriptors open simultaneously (and "too many open files").
func TotalSize(fs *FileSystem, names []string) (int, error) {
	total := 0
	for _, name := range names {
		f, err := fs.Open(name)
		if err != nil {
			return 0, err
		}
		defer f.Close()
		total += f.Size()
	}
	return total, nil
}
