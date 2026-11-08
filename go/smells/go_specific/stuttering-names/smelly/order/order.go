// Package order manages orders (version with stuttering names).
package order

// OrderStatus SMELL: from outside it reads order.OrderStatus.
type OrderStatus string

// Order statuses. SMELL: order.OrderStatusPaid repeats "order" twice.
const (
	OrderStatusPending OrderStatus = "pending"
	OrderStatusPaid    OrderStatus = "paid"
)

// OrderService SMELL: order.OrderService; the package already says "order".
type OrderService struct {
	orders map[string]OrderStatus
}

// NewOrderService SMELL: order.NewOrderService.
func NewOrderService() *OrderService {
	return &OrderService{orders: map[string]OrderStatus{}}
}

// CreateOrder SMELL: svc.CreateOrder inside order.OrderService.
func (s *OrderService) CreateOrder(id string) { s.orders[id] = OrderStatusPending }

// PayOrder marks the order as paid.
func (s *OrderService) PayOrder(id string) { s.orders[id] = OrderStatusPaid }

// OrderStatusOf returns the status of the order.
func (s *OrderService) OrderStatusOf(id string) OrderStatus { return s.orders[id] }
