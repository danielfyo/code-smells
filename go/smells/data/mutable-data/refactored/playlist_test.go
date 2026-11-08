package refactored

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
	if got := TopRated(nil, 3); len(got) != 0 {
		t.Errorf("empty = %v", got)
	}
}

func TestNoMutationLeaks(t *testing.T) {
	p := newPlaylist()
	TopRated(p.Songs(), 1)
	p.Songs()[0].Title = "Hacked"
	if got := p.Songs()[0].Title; got != "Intro" {
		t.Errorf("first song = %q, want Intro", got)
	}
}
