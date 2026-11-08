// Package smelly shows a getter whose name hides side effects: GetSession
// creates and stores sessions without its name saying so.
package smelly

// Session is a user session.
type Session struct {
	UserID string
	Token  string
}

// SessionStore keeps sessions in memory.
type SessionStore struct {
	sessions map[string]*Session
	created  int
}

// NewSessionStore creates an empty store.
func NewSessionStore() *SessionStore {
	return &SessionStore{sessions: map[string]*Session{}}
}

// GetSession SMELL: looks like an innocent query, but if the session does not
// exist it creates and persists it. Anyone using it to "check whether there is
// a session" creates ghost sessions by accident.
func (s *SessionStore) GetSession(userID string) *Session {
	if sess, ok := s.sessions[userID]; ok {
		return sess
	}
	s.created++
	sess := &Session{UserID: userID, Token: "tok-" + userID}
	s.sessions[userID] = sess
	return sess
}

// Count returns how many sessions there are.
func (s *SessionStore) Count() int { return len(s.sessions) }
