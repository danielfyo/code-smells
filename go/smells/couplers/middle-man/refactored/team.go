// Package refactored fixes Middle Man by removing the forwarding methods:
// Team exposes its Roster and clients talk directly to whoever does the
// work. Team keeps only what is really its own.
package refactored

import "sort"

// Roster manages the squad of players.
type Roster struct{ players map[int]string }

// NewRoster creates an empty squad.
func NewRoster() *Roster { return &Roster{players: map[int]string{}} }

// Add assigns a shirt number.
func (r *Roster) Add(number int, name string) { r.players[number] = name }

// Remove frees a shirt number.
func (r *Roster) Remove(number int) { delete(r.players, number) }

// Player looks up by shirt number.
func (r *Roster) Player(number int) (string, bool) { n, ok := r.players[number]; return n, ok }

// Names returns the sorted names.
func (r *Roster) Names() []string {
	out := make([]string, 0, len(r.players))
	for _, n := range r.players {
		out = append(out, n)
	}
	sort.Strings(out)
	return out
}

// Team no longer forwards anything.
// REFACTOR: Remove Middle Man. The client accesses Roster directly.
type Team struct {
	Name   string
	Roster *Roster
}

// NewTeam creates a team.
func NewTeam(name string) *Team { return &Team{Name: name, Roster: NewRoster()} }
