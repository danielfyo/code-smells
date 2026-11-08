import { useState } from "react";

// SMELL: Duplicate Code. Both forms repeat the same state, the same regular
// expression, the same message and the same email-field markup. If validation
// changes tomorrow we will have to remember to change it in both places.
export function NewsletterForm({ onSubscribe }: { onSubscribe: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(value)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    onSubscribe(value);
  }

  return (
    <form aria-label="newsletter" onSubmit={(e) => (e.preventDefault(), submit())}>
      <label>
        Email <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {error && <span role="alert">{error}</span>}
      <button type="submit">Subscribe</button>
    </form>
  );
}

export function ContactForm({ onSend }: { onSend: (email: string, message: string) => void }) {
  // SMELL: copy-paste of the block above.
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function submit() {
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(value)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    onSend(value, message);
  }

  return (
    <form aria-label="contact" onSubmit={(e) => (e.preventDefault(), submit())}>
      <label>
        Email <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {error && <span role="alert">{error}</span>}
      <label>
        Message <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
