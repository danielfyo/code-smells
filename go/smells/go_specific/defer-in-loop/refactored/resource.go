package refactored

import "fmt"

// FileSystem simulates a file system that counts open descriptors.
type FileSystem struct {
	open    int
	MaxOpen int // maximum number of files open at the same time during the run
}

// File is an open file.
type File struct {
	fs   *FileSystem
	name string
}

// Open opens a file.
func (fs *FileSystem) Open(name string) (*File, error) {
	if name == "" {
		return nil, fmt.Errorf("open: empty name")
	}
	fs.open++
	fs.MaxOpen = max(fs.MaxOpen, fs.open)
	return &File{fs: fs, name: name}, nil
}

// Close closes the file.
func (f *File) Close() error {
	f.fs.open--
	return nil
}

// Size returns a fake size (the length of the name).
func (f *File) Size() int { return len(f.name) }

// OpenCount returns the files open right now.
func (fs *FileSystem) OpenCount() int { return fs.open }
