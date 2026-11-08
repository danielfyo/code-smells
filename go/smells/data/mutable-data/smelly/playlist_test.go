package smelly

import "testing"

func newPlaylist() *Playlist {
	p := &Playlist{}
	p.Add(Song{"Intro", 3})
	p.Add(Song{"Hit", 5})
	p.Add(Song{"B-side", 1})
	return p
}

func TestTopRated(t *testing.T) {
	top := TopRated(newPlaylist().Songs(), 2)
	if len(top) != 2 || top[0].Title != "Hit" || top[1].Title != "Intro" {
		t.Errorf("top = %v", top)
	}
}

// Documents the bug: the operations mutate the original playlist.
func TestMutationLeaks(t *testing.T) {
	p := newPlaylist()
	TopRated(p.Songs(), 1)
	if p.Songs()[0].Title != "Hit" {
		t.Error("expected the playlist order to be altered by TopRated")
	}
	p.Songs()[0].Title = "Hacked"
	if p.Songs()[0].Title != "Hacked" {
		t.Error("expected external writes to reach the playlist")
	}
}
