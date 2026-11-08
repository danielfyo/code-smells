package smelly

import "testing"

func TestValidateAndSave(t *testing.T) {
	var r Registry
	if err := r.ValidateAndSave(" ana@shop.test "); err != nil {
		t.Fatal(err)
	}
	if err := r.ValidateAndSave("nope"); err == nil {
		t.Fatal("expected error")
	}
	if len(r.Users) != 1 || r.Users[0].Email != "ana@shop.test" {
		t.Fatalf("users = %+v", r.Users)
	}
}
