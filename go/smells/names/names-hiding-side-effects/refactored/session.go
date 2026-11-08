// Package refactored separates the pure query from the command with side
// effects and names the one that creates sessions explicitly.
package refactored

// Session is a user session.
type Session struct {
	UserID string
	Token  string
}

// SessionStore keeps sessions in memory.
type SessionStore struct {
	sessions map[string]*Session
}

// NewSessionStore creates an empty store.
func NewSessionStore() *SessionStore {
	return &SessionStore{sessions: map[string]*Session{}}
}

// Session returns the user's session, if any. It modifies nothing.
//
// REFACTOR: Separate Query from Modifier; the query has no side effects.
func (s *SessionStore) Session(userID string) (*Session, bool) {
	sess, ok := s.sessions[userID]
	return sess, ok
}

// FindOrCreateSession returns the user's session, creating it if missing.
//
// REFACTOR: Rename Method; the name declares the side effect.
func (s *SessionStore) FindOrCreateSession(userID string) *Session {
	if sess, ok := s.sessions[userID]; ok {
		return sess
	}
	sess := &Session{UserID: userID, Token: "tok-" + userID}
	s.sessions[userID] = sess
	return sess
}

// Count returns how many sessions there are.
func (s *SessionStore) Count() int { return len(s.sessions) }
