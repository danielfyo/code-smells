import { useState } from "react";

// REFACTOR: Extract Function + Extract Custom Hook + Extract Component. The
// shared rule, state and markup live in a single place.
export function normalizeEmail(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(value) ? value : null;
}

function useEmailField() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Returns the normalized email or null (and shows the error).
  function validate(): string | null {
    const value = normalizeEmail(email);
    setError(value ? "" : "Please enter a valid email");
    return value;
  }

  return { email, setEmail, error, validate };
}

function EmailField({ value, error, onChange }: { value: string; error: string; onChange: (v: string) => void }) {
  return (
    <>
      <label>
        Email <input value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
      {error && <span role="alert">{error}</span>}
    </>
  );
}

export function NewsletterForm({ onSubscribe }: { onSubscribe: (email: string) => void }) {
  const field = useEmailField();
  function submit() {
    const email = field.validate();
    if (email) onSubscribe(email);
  }
  return (
    <form aria-label="newsletter" onSubmit={(e) => (e.preventDefault(), submit())}>
      <EmailField value={field.email} error={field.error} onChange={field.setEmail} />
      <button type="submit">Subscribe</button>
    </form>
  );
}

export function ContactForm({ onSend }: { onSend: (email: string, message: string) => void }) {
  const field = useEmailField();
  const [message, setMessage] = useState("");
  function submit() {
    const email = field.validate();
    if (email) onSend(email, message);
  }
  return (
    <form aria-label="contact" onSubmit={(e) => (e.preventDefault(), submit())}>
      <EmailField value={field.email} error={field.error} onChange={field.setEmail} />
      <label>
        Message <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
