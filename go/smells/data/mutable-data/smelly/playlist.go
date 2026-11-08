// Package smelly illustrates Mutable Data: Playlist returns its internal
// slice and TopRated sorts the slice it receives, so data changes in
// unexpected places (the caller alters the list and the list gets reordered).
package smelly

import "sort"

// Song is a rated song.
type Song struct {
	Title  string
	Rating int
}

// Playlist is a music playlist.
type Playlist struct{ songs []Song }

// Add adds a song.
func (p *Playlist) Add(s Song) { p.songs = append(p.songs, s) }

// Songs returns the songs.
// SMELL: Mutable Data. It exposes the internal slice: whoever receives it
// can modify the playlist without going through its methods.
func (p *Playlist) Songs() []Song { return p.songs }

// TopRated returns the n best rated songs.
// SMELL: it sorts the received slice in place, mutating the caller's data.
func TopRated(songs []Song, n int) []Song {
	sort.Slice(songs, func(i, j int) bool { return songs[i].Rating > songs[j].Rating })
	if n > len(songs) {
		n = len(songs)
	}
	return songs[:n]
}
