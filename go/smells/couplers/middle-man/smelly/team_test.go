package smelly

import (
	"slices"
	"testing"
)

func TestTeam(t *testing.T) {
	team := NewTeam("Tigers")
	team.AddPlayer(10, "Sara")
	team.AddPlayer(7, "Marta")
	team.AddPlayer(3, "Iker")
	team.RemovePlayer(3)
	if n, ok := team.Player(10); !ok || n != "Sara" {
		t.Errorf("player 10 = %q", n)
	}
	if got := team.PlayerNames(); !slices.Equal(got, []string{"Marta", "Sara"}) {
		t.Errorf("names = %v", got)
	}
}
