import { useState, type FormEvent } from "react";

// Production code: newsletter subscription form.
export interface NewsletterFormProps {
  onSubscribe: (email: string) => void;
}

export function NewsletterForm({ onSubscribe }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    setError(null);
    onSubscribe(email);
  };

  return (
    <form className="nl-form" onSubmit={handleSubmit}>
      <div className="nl-form__row">
        <label htmlFor="nl-email">Email</label>
        <input id="nl-email" className="nl-form__input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {error && (
        <span className="nl-form__error" role="alert">
          {error}
        </span>
      )}
      <button className="btn btn--primary" type="submit">
        Subscribe
      </button>
    </form>
  );
}
