// Package smelly illustrates Middle Man: Team adds no logic of its own;
// almost all of its methods just forward the call to Roster.
package smelly

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

// Team is a middle man.
// SMELL: Middle Man. Four methods that only delegate; every new Roster
// method requires adding another forwarder here.
type Team struct {
	Name   string
	roster *Roster
}

// NewTeam creates a team.
func NewTeam(name string) *Team { return &Team{Name: name, roster: NewRoster()} }

// AddPlayer delegates.
func (t *Team) AddPlayer(number int, name string) { t.roster.Add(number, name) }

// RemovePlayer delegates.
func (t *Team) RemovePlayer(number int) { t.roster.Remove(number) }

// Player delegates.
func (t *Team) Player(number int) (string, bool) { return t.roster.Player(number) }

// PlayerNames delegates.
func (t *Team) PlayerNames() []string { return t.roster.Names() }
