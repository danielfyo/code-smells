import { useState } from "react";

// REFACTOR: Rename Variable (to positive) + Consolidate Conditional. Variables
// express what DOES happen (`isEmailValid`, `accepted`, `canSubmit`) and the
// conditions can be read aloud without stumbling.
export function SignupButton({ email }: { email: string }) {
  const [accepted, setAccepted] = useState(false);
  const isEmailValid = email.includes("@");
  const canSubmit = isEmailValid && accepted;

  return (
    <div>
      <label>
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
        I accept the terms
      </label>
      <button disabled={!canSubmit}>Create account</button>
      {isEmailValid ? null : <small>Invalid email</small>}
    </div>
  );
}
