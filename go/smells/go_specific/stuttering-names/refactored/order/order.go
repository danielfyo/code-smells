// Package order manages orders. Names are designed to be read together with
// the package name: order.Service, order.Status, order.Paid.
package order

// Status is the status of an order.
//
// REFACTOR: Rename without repeating the package (order.OrderStatus → order.Status).
type Status string

// Order statuses.
const (
	Pending Status = "pending"
	Paid    Status = "paid"
)

// Service manages the lifecycle of orders.
type Service struct {
	orders map[string]Status
}

// NewService creates the service (order.NewService).
func NewService() *Service { return &Service{orders: map[string]Status{}} }

// Create registers a pending order.
func (s *Service) Create(id string) { s.orders[id] = Pending }

// Pay marks the order as paid.
func (s *Service) Pay(id string) { s.orders[id] = Paid }

// Status returns the status of the order.
func (s *Service) Status(id string) Status { return s.orders[id] }
