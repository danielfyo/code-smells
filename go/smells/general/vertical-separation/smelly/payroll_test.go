package smelly

import "testing"

func TestMonthlyPay(t *testing.T) {
	cases := []struct {
		e    Employee
		want int64
	}{
		{Employee{1000, 100}, 100000},
		{Employee{1000, 170}, 175000},
		{Employee{1033, 10}, 10300},
	}
	for _, c := range cases {
		if got := MonthlyPay(c.e); got != c.want {
			t.Errorf("MonthlyPay(%+v) = %d, want %d", c.e, got, c.want)
		}
	}
}
