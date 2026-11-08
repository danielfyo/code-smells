// Package smelly illustrates Speculative Generality: a newsletter subscriber
// list was built with a generic repository, hooks, strategies and options
// "in case we need them some day". Nobody uses them.
package smelly

import (
	"errors"
	"strings"
)

// SMELL: Speculative Generality. Generic interface with a single
// implementation and methods nobody calls (Update, Query).
type Repository[T any] interface {
	Add(item T) error
	Update(item T) error
	Query(filter func(T) bool) []T
	Count() int
}

// Hook is a hook that is never configured.
type Hook func(email string) error

// NormalizationStrategy is a strategy with only one possible variant.
type NormalizationStrategy interface{ Normalize(s string) string }

// LowerCaseStrategy is the only strategy.
type LowerCaseStrategy struct{}

// Normalize lowercases the input.
func (LowerCaseStrategy) Normalize(s string) string { return strings.ToLower(strings.TrimSpace(s)) }

// SubscriberList implements the generic repository.
type SubscriberList struct {
	items      []string
	strategy   NormalizationStrategy
	beforeAdd  Hook // SMELL: always nil
	afterAdd   Hook // SMELL: always nil
	maxRetries int  // SMELL: parameter reserved "for the future"
}

// NewSubscriberList accepts options nobody passes.
func NewSubscriberList(strategy NormalizationStrategy, before, after Hook, maxRetries int) *SubscriberList {
	return &SubscriberList{strategy: strategy, beforeAdd: before, afterAdd: after, maxRetries: maxRetries}
}

// Add adds a subscriber.
func (l *SubscriberList) Add(email string) error {
	email = l.strategy.Normalize(email)
	if !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	if l.beforeAdd != nil {
		if err := l.beforeAdd(email); err != nil {
			return err
		}
	}
	for _, e := range l.items {
		if e == email {
			return errors.New("already subscribed")
		}
	}
	l.items = append(l.items, email)
	if l.afterAdd != nil {
		return l.afterAdd(email)
	}
	return nil
}

// Update makes no sense for emails, but the interface demands it.
func (l *SubscriberList) Update(string) error { return errors.New("not implemented") }

// Query is never called.
func (l *SubscriberList) Query(filter func(string) bool) []string {
	var out []string
	for _, e := range l.items {
		if filter(e) {
			out = append(out, e)
		}
	}
	return out
}

// Count returns the number of subscribers.
func (l *SubscriberList) Count() int { return len(l.items) }

var _ Repository[string] = (*SubscriberList)(nil)
