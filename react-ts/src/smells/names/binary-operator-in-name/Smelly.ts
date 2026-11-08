export interface SignupForm {
  email: string;
  password: string;
}

export interface UserStore {
  save(form: SignupForm): void;
}

// SMELL: the "And" in the name reveals two responsibilities: validate AND save.
// You can't validate without saving (e.g. while typing) or save already-validated data.
export function validateAndSave(form: SignupForm, store: UserStore): string[] {
  const errors: string[] = [];
  if (!form.email.includes("@")) errors.push("Invalid email");
  if (form.password.length < 8) errors.push("Password must be at least 8 characters");
  if (errors.length === 0) store.save(form);
  return errors;
}
