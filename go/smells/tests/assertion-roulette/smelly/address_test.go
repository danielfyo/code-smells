package smelly

import "testing"

// SMELL: many assertions without a message. When it fails the report says
// "address_test.go:13: FAIL" and you must open the file and count lines to
// learn which field, with which value and why.
func TestParseAddress(t *testing.T) {
	a, err := ParseAddress(" Calle Mayor 1 ; Zaragoza ; 50001 ; es ")
	if err != nil {
		t.Fail()
	}
	if a.Street != "Calle Mayor 1" {
		t.Fail()
	}
	if a.City != "Zaragoza" {
		t.Fail()
	}
	if a.PostalCode != "50001" {
		t.Fail()
	}
	if a.Country != "ES" {
		t.Fail()
	}
	if _, err := ParseAddress("just one part"); err == nil {
		t.Fail()
	}
}
