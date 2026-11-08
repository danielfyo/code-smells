import { useState } from "react";

// SMELL: Negative Conditionals. Negative names (`isNotValid`, `notAccepted`)
// combined with `!` produce double negations such as
// `!(!isNotValid && !notAccepted)`. You have to stop and "un-negate" mentally.
export function SignupButton({ email }: { email: string }) {
  const [notAccepted, setNotAccepted] = useState(true);
  const isNotValid = !email.includes("@");
  const isNotDisabled = !(!(!isNotValid && !notAccepted));

  return (
    <div>
      <label>
        <input type="checkbox" checked={!notAccepted} onChange={(e) => setNotAccepted(!e.target.checked)} />
        I accept the terms
      </label>
      <button disabled={!isNotDisabled}>Create account</button>
      {!(!isNotValid) ? <small>Invalid email</small> : null}
    </div>
  );
}
