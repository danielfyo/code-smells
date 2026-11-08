import { useState } from "react";

export type SubmitApi = (data: { name: string; email: string }) => Promise<void>;

// SMELL: useState explosion. Six related states that must change together (isLoading,
// isError, isSuccess, errorMessage...). It's easy to leave them in impossible combinations:
// here, after an error followed by a success, isError is still true.
export function ContactForm({ submit }: { submit: SubmitApi }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await submit({ name, email });
      setIsSuccess(true);
      // SMELL: forgot to reset isError and errorMessage
    } catch (error) {
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit} disabled={isLoading}>
        Send
      </button>
      {isError && <p role="alert">{errorMessage}</p>}
      {isSuccess && <p role="status">Message sent</p>}
    </div>
  );
}
