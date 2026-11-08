package refactored

import (
	"slices"
	"testing"
)

func TestTeam(t *testing.T) {
	team := NewTeam("Tigers")
	team.Roster.Add(10, "Sara")
	team.Roster.Add(7, "Marta")
	team.Roster.Add(3, "Iker")
	team.Roster.Remove(3)
	if n, ok := team.Roster.Player(10); !ok || n != "Sara" {
		t.Errorf("player 10 = %q", n)
	}
	if got := team.Roster.Names(); !slices.Equal(got, []string{"Marta", "Sara"}) {
		t.Errorf("names = %v", got)
	}
}
