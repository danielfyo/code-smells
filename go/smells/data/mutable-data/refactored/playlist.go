// Package refactored fixes Mutable Data with defensive copies and pure
// functions: Playlist never shares its internal slice and TopRated works
// on a copy without touching its argument.
package refactored

import (
	"cmp"
	"slices"
)

// Song is a rated song (a value type, copied when passed).
type Song struct {
	Title  string
	Rating int
}

// Playlist is a music playlist.
type Playlist struct{ songs []Song }

// Add adds a song.
func (p *Playlist) Add(s Song) { p.songs = append(p.songs, s) }

// Songs returns a copy of the songs.
// REFACTOR: Encapsulate Collection (defensive copy).
func (p *Playlist) Songs() []Song { return slices.Clone(p.songs) }

// TopRated returns the n best rated songs without modifying the input.
// REFACTOR: Separate Query from Modifier / pure function.
func TopRated(songs []Song, n int) []Song {
	sorted := slices.Clone(songs)
	slices.SortStableFunc(sorted, func(a, b Song) int { return cmp.Compare(b.Rating, a.Rating) })
	return sorted[:min(n, len(sorted))]
}
