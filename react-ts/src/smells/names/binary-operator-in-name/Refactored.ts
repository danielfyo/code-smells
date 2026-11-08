export interface SignupForm {
  email: string;
  password: string;
}

export interface UserStore {
  save(form: SignupForm): void;
}

// REFACTOR: Split Function. Each function does one thing and its name needs no "And".
export function validateSignup(form: SignupForm): string[] {
  const errors: string[] = [];
  if (!form.email.includes("@")) errors.push("Invalid email");
  if (form.password.length < 8) errors.push("Password must be at least 8 characters");
  return errors;
}

// REFACTOR: the orchestration is explicit and each step is reusable on its own.
export function registerUser(form: SignupForm, store: UserStore): string[] {
  const errors = validateSignup(form);
  if (errors.length === 0) store.save(form);
  return errors;
}
