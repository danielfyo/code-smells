// Package smelly shows names that do not communicate intent (d, tmp, data2, proc).
package smelly

// SMELL: what is D? What do A, B and C hold? The reader has to guess.
type D struct {
	A string
	B int64
	C bool
}

// Proc SMELL: generic name; it says neither what it processes nor what it returns.
func Proc(data2 []D) int64 {
	var tmp int64
	for _, x := range data2 {
		if !x.C {
			tmp += x.B
		}
	}
	return tmp
}
