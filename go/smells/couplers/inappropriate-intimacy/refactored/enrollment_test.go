package refactored

import "testing"

func TestEnroll(t *testing.T) {
	s := NewStudent("Lucia")
	maths := &Course{Code: "MAT1", Credits: 12}
	physics := &Course{Code: "FIS1", Credits: 12}
	art := &Course{Code: "ART1", Credits: 9}
	if err := maths.Enroll(s); err != nil {
		t.Fatal(err)
	}
	if err := physics.Enroll(s); err != nil {
		t.Fatal(err)
	}
	if err := maths.Enroll(s); err == nil {
		t.Error("expected already enrolled")
	}
	if err := art.Enroll(s); err == nil {
		t.Error("expected credit limit")
	}
	if s.Credits() != 24 || maths.Size() != 1 || art.Size() != 0 {
		t.Errorf("credits=%d maths=%d art=%d", s.Credits(), maths.Size(), art.Size())
	}
}
